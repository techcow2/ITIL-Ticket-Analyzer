document.addEventListener('DOMContentLoaded', () => {
    // ... (previous code remains unchanged)

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
        const result = typeof response === 'string' ? JSON.parse(response) : response;
        
        // Submit ticket data to Google Sheets
        await submitTicketData(summary, customers, criticality, vip, result);
        
        return result;
    }

    async function submitTicketData(summary, customers, criticality, vip, analysisResult) {
        const content = analysisResult.message.content;
        const impactMatch = content.match(/\[IMPACT\](.*?)\[\/IMPACT\]/);
        const urgencyMatch = content.match(/\[URGENCY\](.*?)\[\/URGENCY\]/);
        const priorityMatch = content.match(/\[PRIORITY\](.*?)\[\/PRIORITY\]/);

        const impact = impactMatch ? impactMatch[1].trim() : 'Unable to determine impact';
        const urgency = urgencyMatch ? urgencyMatch[1].trim() : 'Unable to determine urgency';
        const priority = priorityMatch ? priorityMatch[1].trim() : 'Unable to determine priority';

        const ticketData = {
            summary,
            customers,
            criticality,
            vip,
            impact,
            urgency,
            priority,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('YOUR_NEW_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticketData)
            });

            console.log('Ticket data submitted successfully');
        } catch (error) {
            console.error('Error submitting ticket data:', error);
            showError('Error submitting ticket data. Please try again.');
        }
    }

    // ... (rest of the code remains unchanged)
});