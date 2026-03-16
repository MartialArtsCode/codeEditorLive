const starterTemplates = {
  monolithic: {
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Monolithic App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Monolithic Mode</h1>
  <script src="script.js"></script>
</body>
</html>`,
    "style.css": `body { font-family: Arial; background: #f0f8ff; padding: 20px; }`,
    "script.js": `console.log("Monolithic script running");`
  },
  modular: {
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Modular App</title>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <h1>Modular Mode</h1>
  <div id="app"></div>
  <script type="module" src="main.js"></script>
</body>
</html>`,
    "styles/main.css": `body { background: #e8f5e9; } h1 { color: #2e7d32; }`,
    "main.js": `import { greet } from './utils.js';\ndocument.getElementById('app').innerHTML = greet();`,
    "utils.js": `export function greet() { return "<p>Hello from modular mode!</p>"; }`
  },
  fullstack: {
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Fullstack Mock</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Fullstack Mode (Mock API)</h1>
  <button id="fetch-btn">Fetch Data</button>
  <div id="result"></div>
  <script src="client.js"></script>
</body>
</html>`,
    "style.css": `body { padding:30px; font-family:sans-serif; }`,
    "client.js": `document.getElementById('fetch-btn').onclick = async () => {
  const res = await fetch('/api/todos/1');
  const data = await res.json();
  document.getElementById('result').textContent = JSON.stringify(data, null, 2);
};`
  }
};

function loadMode(mode) {
  if (!confirm(`Load ${mode} template? Current files will be replaced.`)) return;
  files = { ...starterTemplates[mode] };
  currentFile = Object.keys(files).find(f => f.endsWith('.html')) || null;
  updateFileList();
  switchFile(currentFile);
  saveToStorage();
}