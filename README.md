
# ITIL Ticket Analyzer

Welcome to the **ITIL Ticket Analyzer** GitHub repository! This web application helps IT help desk teams quickly analyze ticket information and assess impact, urgency, and priority based on the ITIL framework. The application leverages AI to deliver precise recommendations, offering detailed explanations for the assigned levels of impact, urgency, and priority.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [AI-Powered Ticket Analysis](#ai-powered-ticket-analysis)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **AI-Powered Ticket Analysis**: Analyze IT tickets using AI based on ITIL best practices, evaluating critical factors such as the number of affected users, device criticality, and VIP status.
- **Priority, Urgency, and Impact**: Provides a clear assessment of impact, urgency, and priority levels using ITIL standards.
- **Detailed Explanations**: Generates detailed, AI-driven explanations to justify the assigned levels.
- **Responsive Design**: Optimized for various devices with a mobile-friendly UI.
- **Print or Email Results**: Option to print the analysis or generate an email summary directly from the app.
- **User-Friendly Interface**: Clean, intuitive interface with helpful instructions and modal-driven interactions.

Live Demo: https://apps.techray.dev/itil

<img src="https://github.com/user-attachments/assets/6c123779-8edb-4cd8-9b34-0517c9c8e34e" alt="Screenshot 2024-09-16 003438" style="width:15%;">

---

## Technologies Used

- **HTML5**: For structuring the web interface.
- **CSS3**: Used for styling the web application, including responsive design with media queries.
- **JavaScript**: Handles user interactions, form submissions, and AI integration.
- **Tailwind CSS**: For utility-first CSS styling, making the application responsive and easy to maintain.
- **Font Awesome**: Icons used across the application for better visual appeal.
- **AI Integration**: AI-powered analysis via JavaScript for determining ticket impact, urgency, and priority.

---

## Installation

### 1. Clone the Repository

First, clone this repository to your local machine using:

```bash
git clone https://github.com/techcow2/itil-ticket-analyzer.git
```

### 2. Set Up the Project

Ensure that you have an active internet connection to load external libraries (Tailwind CSS, Font Awesome, etc.) or host them locally if needed.

### 3. Run the Application

Open `index.html` in your browser to start using the ITIL Ticket Analyzer.

---

## Usage

### How to Analyze a Ticket

1. **Enter Ticket Information**: Provide a brief summary of the ticket, the number of affected customers, device criticality, and whether a VIP user is impacted.
2. **Click "Analyze Ticket"**: Once the details are entered, click the "Analyze Ticket" button to generate a detailed ITIL-based analysis.
3. **View Results**: The app will display the impact, urgency, and priority along with a comprehensive explanation.
4. **Export Results**: Use the built-in options to either print the analysis or generate an email summary.

### Additional Functionalities:

- **Instructions Modal**: A guide on how to use the app.
- **Welcome Modal**: Introduces users to the app, with links to the Terms of Service and Privacy Policy.
- **Star Rating System**: Allows users to rate the accuracy and usefulness of the results.

---

## File Structure

```bash
itil-ticket-analyzer/
│
├── index.html           # Main HTML file for the web app
├── styles.css           # CSS styles, including responsive design
├── script.js            # JavaScript logic for the app
└── README.md            # This README file
```

---

## AI-Powered Ticket Analysis

The ITIL Ticket Analyzer uses AI to evaluate the provided ticket information. Here’s how it works:

1. **User Input**: Users provide ticket summary, affected customers, device criticality, and VIP status.
2. **AI Processing**: The app sends the data to an AI engine, which analyzes the ticket based on ITIL standards.
3. **Response Formatting**: The AI returns a formatted response with impact, urgency, and priority, along with a detailed explanation of each.

**Note**: This app uses third-party AI processing, so it should not be used for tickets containing sensitive or confidential information.

---

## Contributing

We welcome contributions to improve the ITIL Ticket Analyzer! Please follow these steps to contribute:

1. **Fork the repository**.
2. **Create a new branch** for your feature or bug fix:

   ```bash
   git checkout -b feature-branch
   ```

3. **Commit your changes**:

   ```bash
   git commit -m "Add new feature"
   ```

4. **Push to your branch**:

   ```bash
   git push origin feature-branch
   ```

5. **Open a pull request**, and describe the changes you've made.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Thank you for using the ITIL Ticket Analyzer! If you have any questions or encounter any issues, feel free to open an issue in the repository.
