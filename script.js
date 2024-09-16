document.addEventListener('DOMContentLoaded', () => {
    // Welcome modal functionality
    const welcomeModal = document.getElementById('welcomeModal');
    const acceptButton = document.getElementById('acceptButton');

    function showWelcomeModal() {
        welcomeModal.classList.remove('hidden');
        welcomeModal.classList.add('visible');
    }

    function hideWelcomeModal() {
        welcomeModal.classList.remove('visible');
        welcomeModal.classList.add('hidden');
    }

    function hasAcceptedTerms() {
        return localStorage.getItem('acceptedTerms') === 'true';
    }

    function setAcceptedTerms() {
        localStorage.setItem('acceptedTerms', 'true');
    }

    if (!hasAcceptedTerms()) {
        showWelcomeModal();
    }

    acceptButton.addEventListener('click', () => {
        setAcceptedTerms();
        hideWelcomeModal();
    });

    // Existing code starts here
    const analyzeButton = document.getElementById('analyzeButton');
    const ticketSummary = document.getElementById('ticketSummary');
    const result = document.getElementById('result');
    const priorityResult = document.getElementById('priorityResult');
    const explanation = document.getElementById('explanation');
    const spinner = document.getElementById('spinner');
    const printButton = document.getElementById('printButton');
    const writeEmailButton = document.getElementById('writeEmailButton');
    const emailModal = document.getElementById('emailModal');
    const emailContent = document.getElementById('emailContent');
    const closeModal = document.getElementById('closeModal');
    const copyEmail = document.getElementById('copyEmail');
    const toggleInstructions = document.getElementById('toggleInstructions');
    const instructions = document.getElementById('instructions');
    const resetButton = document.getElementById('resetButton');
    const ratingSystem = document.getElementById('ratingSystem');
    const stars = document.querySelectorAll('.star-rating .star');
    const ratingMessage = document.getElementById('ratingMessage');

    // Dropdown elements
    const affectedCustomers = document.getElementById('affectedCustomers');
    const deviceCriticality = document.getElementById('deviceCriticality');
    const vipAffected = document.getElementById('vipAffected');

    let currentRating = 0;

    // Hide rating system on page load
    ratingSystem.classList.add('hidden');

    // Toggle instructions visibility
    toggleInstructions.addEventListener('click', () => {
        instructions.classList.toggle('hidden');
        instructions.classList.toggle('show');
        const isVisible = !instructions.classList.contains('hidden');
        toggleInstructions.innerHTML = isVisible
            ? '<i class="fas fa-chevron-up mr-2"></i>Hide Instructions'
            : '<i class="fas fa-info-circle mr-2"></i>How to Use';
    });

    // Rate limiting variables
    let tokenBucket = 10;
    const maxTokens = 10;
    const refillRate = 1; // 1 token per 6 seconds (10 per minute)
    let lastRefillTimestamp = Date.now();

    function refillTokenBucket() {
        const now = Date.now();
        const timePassed = now - lastRefillTimestamp;
        const refillTokens = Math.floor(timePassed / 6000) * refillRate;
        tokenBucket = Math.min(maxTokens, tokenBucket + refillTokens);
        lastRefillTimestamp = now;
    }

    function rateLimitRequest() {
        refillTokenBucket();
        if (tokenBucket >= 1) {
            tokenBucket--;
            return true;
        }
        return false;
    }

    analyzeButton.addEventListener('click', async () => {
        const summary = ticketSummary.value.trim();
        const customers = affectedCustomers.value;
        const criticality = deviceCriticality.value;
        const vip = vipAffected.value;

        if (summary === '') {
            showError('Please enter a ticket summary.');
            return;
        }

        // Check for minimum word count
        const wordCount = summary.split(/\s+/).length;
        if (wordCount < 10) {
            showError('Please enter at least 10 words in your issue description.');
            return;
        }

        if (!rateLimitRequest()) {
            showError('Rate limit exceeded. Please wait a moment before trying again.');
            return;
        }

        setLoading(true);

        try {
            const response = await analyzeTicket(summary, customers, criticality, vip);
            await displayResults(response, summary, customers, criticality, vip);
        } catch (error) {
            console.error('Error analyzing ticket:', error);
            showError(`An error occurred while analyzing the ticket: ${error.message}. Please try again.`);
        } finally {
            setLoading(false);
        }
    });

    printButton.addEventListener('click', () => {
        window.print();
    });

    writeEmailButton.addEventListener('click', async () => {
        const summary = ticketSummary.value.trim();
        const customers = affectedCustomers.value;
        const criticality = deviceCriticality.value;
        const vip = vipAffected.value;
        
        if (!rateLimitRequest()) {
            showError('Rate limit exceeded. Please wait a moment before trying again.');
            return;
        }

        setLoading(true);
        try {
            const emailBody = await generateEmail(summary, customers, criticality, vip);
            displayEmail(emailBody);
        } catch (error) {
            console.error('Error generating email:', error);
            showError(`An error occurred while generating the email: ${error.message}. Please try again.`);
        } finally {
            setLoading(false);
        }
    });

    closeModal.addEventListener('click', () => {
        emailModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === emailModal) {
            emailModal.style.display = 'none';
        }
    });

    copyEmail.addEventListener('click', () => {
        const emailText = emailContent.innerText;
        navigator.clipboard.writeText(emailText).then(() => {
            const originalText = copyEmail.innerHTML;
            copyEmail.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
            copyEmail.disabled = true;
            setTimeout(() => {
                copyEmail.innerHTML = originalText;
                copyEmail.disabled = false;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            showError('Failed to copy email content. Please try again.');
        });
    });

    // Updated Reset button functionality
    resetButton.addEventListener('click', () => {
        ticketSummary.value = '';
        affectedCustomers.value = '';
        deviceCriticality.value = '';
        vipAffected.value = '';
        result.classList.add('hidden');
        resetButton.classList.add('hidden');
        writeEmailButton.classList.add('hidden');
        ratingSystem.classList.add('hidden');
        // Clear the analysis results
        priorityResult.innerHTML = '';
        explanation.innerHTML = '';
        // Reset rating
        currentRating = 0;
        highlightStars(0);
        ratingMessage.textContent = '';
    });

    // Handle star rating selection
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            setRating(rating);
            submitRating(rating);
        });

        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            highlightStars(rating);
        });

        star.addEventListener('mouseout', () => {
            highlightStars(currentRating);
        });
    });

    function setRating(rating) {
        currentRating = rating;
        highlightStars(rating);
    }

    function highlightStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    async function submitRating(rating) {
        const summary = ticketSummary.value.trim();
        const priority = priorityResult.textContent.match(/Priority:\s*(\S+)/)[1];

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbwX-iSg7hTWZW6qOEGzxYLQOWkMiCj9Xm-xtGtD2eDUW0j0tYKhqVBW8DYGJQlNMfAH/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `summary=${encodeURIComponent(summary)}&priority=${encodeURIComponent(priority)}&rating=${rating}`
            });

            console.log('Rating submitted successfully');
            ratingMessage.textContent = 'Thank you for your feedback!';
            ratingMessage.style.color = 'green';
        } catch (error) {
            console.error('Error submitting rating:', error);
            ratingMessage.textContent = 'Error submitting rating. Please try again.';
            ratingMessage.style.color = 'red';
        }
    }

    async function analyzeTicket(summary, customers, criticality, vip) {
        let prompt = `Analyze this IT help desk ticket summary and determine the correct Impact, Urgency, and Priority according to ITIL standards. Consider the following information:\n\n`;

        prompt += `Ticket Summary: ${summary}\n\n`;

        if (customers) {
            prompt += `Number of affected customers: ${customers}\n`;
        }
        if (criticality) {
            prompt += `Criticality of affected device: ${criticality}\n`;
        }
        if (vip) {
            prompt += `VIP user affected: ${vip}\n`;
        }

        prompt += `
Use the following format for your response:

[IMPACT]1-High, 2-Medium, or 3-Low[/IMPACT]
[URGENCY]1-High, 2-Medium, or 3-Low[/URGENCY]
[PRIORITY]1-Critical, 2-High, 3-Medium, 4-Low, or 5-Planning[/PRIORITY]

[EXPLANATION]
Your detailed explanation here. Include reasoning for the assigned impact, urgency, and priority levels. Explicitly mention how the ticket summary influenced your analysis. If provided, also explain how the number of affected customers, device criticality, and VIP user status influenced your analysis. Provide clear justification for each rating based on these factors. Start directly with the explanation without any introductory phrases. Separate each section (Impact, Urgency, Priority) with a blank line and start each section with "Impact:", "Urgency:", and "Priority:" respectively.
[/EXPLANATION]`;

        const response = await puter.ai.chat(prompt);
        console.log('AI Response:', response);
        return typeof response === 'string' ? JSON.parse(response) : response;
    }

    async function displayResults(responseObj, summary, customers, criticality, vip) {
        const content = responseObj.message.content;

        const impactMatch = content.match(/\[IMPACT\](.*?)\[\/IMPACT\]/);
        const urgencyMatch = content.match(/\[URGENCY\](.*?)\[\/URGENCY\]/);
        const priorityMatch = content.match(/\[PRIORITY\](.*?)\[\/PRIORITY\]/);
        const explanationMatch = content.match(/\[EXPLANATION\]([\s\S]*?)\[\/EXPLANATION\]/);

        const impact = impactMatch ? impactMatch[1].trim() : 'Unable to determine impact';
        const urgency = urgencyMatch ? urgencyMatch[1].trim() : 'Unable to determine urgency';
        const priority = priorityMatch ? priorityMatch[1].trim() : 'Unable to determine priority';
        
        let explanationSection = explanationMatch ? explanationMatch[1].trim() : '';
        
        if (!explanationSection) {
            explanationSection = content.replace(/\[IMPACT\].*?\[\/IMPACT\]/g, '')
                                       .replace(/\[URGENCY\].*?\[\/URGENCY\]/g, '')
                                       .replace(/\[PRIORITY\].*?\[\/PRIORITY\]/g, '')
                                       .trim();
        }
        
        explanationSection = explanationSection.replace(/\[EXPLANATION\]/g, '')
                                               .replace(/\n{3,}/g, '\n\n')
                                               .trim();
        
        if (!explanationSection) {
            explanationSection = 'No detailed explanation provided. Please review the Impact, Urgency, and Priority assignments.';
        }

        // Split the explanation into separate sections
        const sections = explanationSection.split(/\n\s*\n/);
        const impactExplanation = sections.find(s => s.startsWith('Impact:')) || '';
        const urgencyExplanation = sections.find(s => s.startsWith('Urgency:')) || '';
        const priorityExplanation = sections.find(s => s.startsWith('Priority:')) || '';

        // Function to bold only the first word of each section
        const boldKeywords = (text) => {
            return text.replace(/^(Impact|Urgency|Priority):/gm, '**$1**:');
        };

        const prioritySection = `
            <ul class="space-y-4">
                <li class="text-red-600 text-lg sm:text-xl"><strong>Impact:</strong> <span class="ml-2 font-semibold">${impact}</span></li>
                <li class="text-blue-600 text-lg sm:text-xl"><strong>Urgency:</strong> <span class="ml-2 font-semibold">${urgency}</span></li>
                <li class="text-green-600 text-lg sm:text-xl"><strong>Priority:</strong> <span class="ml-2 font-semibold">${priority}</span></li>
            </ul>
        `;

        priorityResult.innerHTML = prioritySection;

        const converter = new showdown.Converter();
        
        // Create input parameters section, only including selected options
        const inputParameters = [];
        inputParameters.push(`<li><strong>Ticket Summary:</strong> ${summary}</li>`);
        if (customers) inputParameters.push(`<li><strong>Number of affected customers:</strong> ${customers}</li>`);
        if (criticality) inputParameters.push(`<li><strong>Criticality of affected device:</strong> ${criticality}</li>`);
        if (vip) inputParameters.push(`<li><strong>VIP user affected:</strong> ${vip}</li>`);

        const inputParametersSection = `
            <div class="input-parameters mb-4">
                <h4 class="font-bold mb-2">Input Parameters:</h4>
                <ul class="list-disc list-inside">
                    ${inputParameters.join('')}
                </ul>
            </div>
        `;

        const explanationHTML = `
            ${inputParametersSection}
            <div class="explanation-content space-y-6">
                <div class="bg-red-50 p-4 rounded-md">
                    ${converter.makeHtml(boldKeywords(impactExplanation))}
                </div>
                <div class="bg-blue-50 p-4 rounded-md">
                    ${converter.makeHtml(boldKeywords(urgencyExplanation))}
                </div>
                <div class="bg-green-50 p-4 rounded-md">
                    ${converter.makeHtml(boldKeywords(priorityExplanation))}
                </div>
            </div>
        `;
        explanation.innerHTML = explanationHTML;

        result.classList.remove('hidden');
        ratingSystem.classList.remove('hidden');
        
        // Show or hide the "Write E-mail" button based on impact, urgency, and priority
        const isHighestPriority = impact.startsWith('1-High') && urgency.startsWith('1-High') && priority.startsWith('1-Critical');
        writeEmailButton.classList.toggle('hidden', !isHighestPriority);

        // Show the Reset button
        resetButton.classList.remove('hidden');

        // Add fade-in animation to results
        result.style.opacity = '0';
        result.style.display = 'block';
        await new Promise(resolve => setTimeout(resolve, 10)); // Small delay for the display change to take effect
        result.style.transition = 'opacity 0.5s ease-in-out';
        result.style.opacity = '1';

        // Smooth scroll to results
        result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function generateEmail(summary, customers, criticality, vip) {
        const prompt = `Write a professional email to notify relevant stakeholders about a high-priority IT issue. The email should be concise, informative, and convey the urgency of the situation. Use the following information as the basis for the email:

Ticket summary: "${summary}"
Number of affected customers: ${customers}
Criticality of affected device: ${criticality}
VIP user affected: ${vip}

The email should include:
1. A clear subject line
2. A brief introduction stating the purpose of the email
3. A summary of the issue, including the number of affected customers, device criticality, and VIP user status
4. The impact and urgency of the situation
5. Any immediate actions being taken
6. A call to action or next steps for the recipients
7. A professional closing

Please format the email as follows:
[SUBJECT]Email subject here[/SUBJECT]
[BODY]
Email body here
[/BODY]`;

        const response = await puter.ai.chat(prompt);
        console.log('AI Email Response:', response);
        const content = typeof response === 'string' ? JSON.parse(response).message.content : response.message.content;

        const subjectMatch = content.match(/\[SUBJECT\](.*?)\[\/SUBJECT\]/);
        const bodyMatch = content.match(/\[BODY\]([\s\S]*?)\[\/BODY\]/);

        const subject = subjectMatch ? subjectMatch[1].trim() : 'High Priority IT Issue';
        const body = bodyMatch ? bodyMatch[1].trim() : content;

        return { subject, body };
    }

    function displayEmail({ subject, body }) {
        const converter = new showdown.Converter();
        const emailHTML = `
            <h3 class="text-xl font-bold mb-2">Subject: ${subject}</h3>
            <div class="bg-white p-4 rounded-md border border-gray-300">
                ${converter.makeHtml(body)}
            </div>
        `;
        emailContent.innerHTML = emailHTML;
        emailModal.style.display = 'block';
    }

    function setLoading(isLoading) {
        analyzeButton.disabled = isLoading;
        analyzeButton.innerHTML = isLoading ? 'Analyzing...' : 'Analyze Ticket';
        spinner.classList.toggle('hidden', !isLoading);
        
        if (isLoading) {
            result.classList.add('hidden');
            resetButton.classList.add('hidden');
        }
    }

    function showError(message) {
        alert(message);
    }
});
