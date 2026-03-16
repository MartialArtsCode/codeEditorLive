let cy = null;

function parseDependencies() {
  const nodes = new Set();
  const edges = [];

  Object.keys(files).forEach(file => {
    nodes.add(file);
    const content = files[file];

    [...content.matchAll(/<link[^>]*href=["'](.*?)["']/gi)].forEach(m => {
      const t = m[1].trim();
      if (!t.startsWith('http') && !t.startsWith('//')) {
        edges.push({ source: file, target: t });
        nodes.add(t);
      }
    });

    [...content.matchAll(/<script[^>]*src=["'](.*?)["']/gi)].forEach(m => {
      const t = m[1].trim();
      if (!t.startsWith('http') && !t.startsWith('//')) {
        edges.push({ source: file, target: t });
        nodes.add(t);
      }
    });

    [...content.matchAll(/import.*from\s*["'](.*?)["']/g)].forEach(m => {
      const t = m[1].trim();
      if (!t.startsWith('http')) {
        edges.push({ source: file, target: t });
        nodes.add(t);
      }
    });
  });

  return Array.from(nodes).map(id => ({ data: { id, label: id } }))
    .concat(edges.map(e => ({ data: { source: e.source, target: e.target } })));
}

function updateGraph() {
  const container = document.getElementById('dependency-graph');
  if (cy) cy.destroy();

  cy = cytoscape({
    container,
    elements: parseDependencies(),
    style: [
      { selector: 'node', style: { 'background-color': '#90caf9', 'label': 'data(label)', 'text-valign': 'center', 'color': '#000' } },
      { selector: 'edge', style: { 'width': 2, 'line-color': '#555', 'target-arrow-color': '#555', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' } }
    ],
    layout: { name: 'dagre', rankDir: 'TB', nodeSep: 40 }
  });

  cy.fit();
}