# Browser IDE

## Overview

The **Browser IDE** is a web-based integrated development environment that allows users to write, edit, and visualize code in real time. With support for HTML, CSS, JavaScript, and backend API integration, this IDE aims to streamline the development process with an intuitive interface.

## Features

- **Multi-language Support**: Write and preview HTML, CSS, and JavaScript code.
- **Real-time Rendering**: See live updates as you modify code in the editor.
- **Dependency Graph**: Visualize relationships between code files and components.
- **Mode Selector**: Choose between different project architectures (Monolithic, Modular, Fullstack).
- **Responsive Design**: Works well on both desktop and mobile devices.

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript
  - [Monaco Editor](https://microsoft.github.io/monaco-editor/)

- **Backend**:
  - Mock API server

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/username/browser-ide.git
   cd browser-ide
   
2. Open index.html in a web browser.
Usage

Select a file type (HTML, CSS, JS) from the navigator.
Write your code in the editor panel.
Click the Load Users button to interact with the mock API (available for the JavaScript files).
View real-time previews in the preview panel.

Folder Structure

codeEditorLive/
├── index.html           # Main entry point
├── core/
│   ├── projectManager.js       # Manages project files
│   ├── renderer.js              # Renders the code preview
│   ├── modeController.js        # Handles mode switching
├── ui/
│   ├── editorPanel.js           # Editor panel functionality
│   ├── fileNavigator.js          # File navigator
├── visualization/
│   ├── dependencyGraph.js       # Visualizes code dependencies
└── backend/
    ├── mockServer.js            # Mock server for API calls


Contributing

We welcome contributions! Please fork the repository and submit a pull request for any improvements or bug fixes.

License

This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments

Thanks to the contributors of the Monaco Editor for their incredible work.
Inspiration from various code editors and IDE projects.
Code


### Key Sections Explained

- **Overview**: Brief introduction to what the project is about.
- **Features**: List the main features users can expect.
- **Technologies Used**: Highlight the tech stack powering the application.
- **Installation**: Instructions for getting the project up and running.
- **Usage**: Basic usage instructions for interacting with the IDE.
- **Folder Structure**: Outline the project's directory for better navigation.
- **Contributing**: Invitation for others to contribute to your project.
- **License**: State the licensing terms.
- **Acknowledgments**: Recognize resources or individuals that influenced your project.

Feel free to customize any section further based on your specific project details!
