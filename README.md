# Script-O-Matic

Script-O-Matic is a whimsical web application that transforms your digital typing into a personalized, handwritten note. By drawing your own alphabet in the "Letter Workshop," you create a unique font that the app uses to render your messages on colorful, digital "paper."

## Features

- **Custom Handwriting**: Draw each letter of the alphabet to create your own digital script.
- **Letter Workshop**: An intuitive interface for capturing and saving your custom handwriting.
- **Alphabet Gallery**: View and manage your captured characters.
- **Dynamic Themes**: Choose from a variety of vibrant background colors (Coral, Golden, Spring, Sky) for your notes.
- **High-Quality Export**: Download your finished notes as crisp PNG images.

## File Structure

- `index.html`: The main entry point of the application, now structured with unique IDs (`onboarding-section`, `main-app`, `editor-container`, etc.) for easier targeting.
- `style.css`: Contains all the styling, including Tailwind utility classes and custom layout rules.
- `script.js`: Handles the application logic, drawing canvas functionality (via Fabric.js), and note export (via html2canvas).
- `README.md`: This file, providing project overview and setup instructions.

## How to Run Locally

Since Script-O-Matic is a client-side web application, you can run it easily without a complex build process:

1.  **Clone or Download**: Ensure all project files (`index.html`, `style.css`, `script.js`) are in the same directory.
2.  **Open in Browser**:
    - Simply double-click `index.html` to open it in your default web browser.
    - Alternatively, use a local development server like **Live Server** (VS Code extension) or run `npx serve .` in your terminal for a smoother experience.
3.  **Internet Connection**: Note that the application loads dependencies (Alpine.js, Tailwind CSS, Fabric.js, html2canvas) via CDN, so an active internet connection is required.

## Technologies Used

- **Tailwind CSS**: For modern, responsive styling.
- **Alpine.js**: For lightweight state management and interactivity.
- **Fabric.js**: For the interactive drawing canvas.
- **html2canvas**: For capturing and downloading the handwritten notes.
