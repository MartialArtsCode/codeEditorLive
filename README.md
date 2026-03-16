# Browser IDE

A simple in-browser code editor with live preview, file management, dependency graph, and mock API support.

## Features

- Monaco Editor (desktop) + textarea fallback (mobile)
- Real-time preview in iframe
- Multiple files & modes (Monolithic / Modular / Fullstack)
- Basic mock API router
- Dependency graph with Cytoscape.js
- LocalStorage persistence

## How to run locally

1. Clone or download the repository
2. Open `index.html` in a browser  
   → best with a local server:  
     - VS Code Live Server  
     - `npx serve`  
     - `python -m http.server`

## Technologies

- Monaco Editor (CDN)
- Cytoscape.js (CDN)
- Highlight.js (mobile fallback)
- Pure JavaScript + HTML/CSS

## License

MIT