let cy = null;

function parseDependencies() {
    const nodes = new Set();
    const edges = [];

    // Process each file to extract dependencies
    Object.keys(files).forEach(file => {
        nodes.add(file);
        const content = files[file];

        extractLinks(content, file, edges, /<link[^>]*href=["'](.*?)["']/gi);
        extractLinks(content, file, edges, /<script[^>]*src=["'](.*?)["']/gi);
        extractImports(content, file, edges);
    });

    return createElementsArray(nodes, edges);
}

function extractLinks(content, sourceFile, edges, regex) {
    [...content.matchAll(regex)].forEach(match => {
        const target = match[1].trim();
        if (!target.startsWith('http') && !target.startsWith('//')) {
            edges.push({ source: sourceFile, target });
        }
    });
}

function extractImports(content, sourceFile, edges) {
    [...content.matchAll(/import.*from\s*["'](.*?)["']/g)].forEach(match => {
        const target = match[1].trim();
        if (!target.startsWith('http')) {
            edges.push({ source: sourceFile, target });
        }
    });
}

function createElementsArray(nodes, edges) {
    const nodeElements = Array.from(nodes).map(id => ({
        data: { id, label: id }
    }));
    
    const edgeElements = edges.map(e => ({
        data: { source: e.source, target: e.target }
    }));

    return nodeElements.concat(edgeElements);
}

function updateGraph() {
    const container = document.getElementById('dependency-graph');
    
    // Destroy existing Cytoscape instance if it exists
    if (cy) cy.destroy();

    // Initialize new Cytoscape instance
    cy = cytoscape({
        container,
        elements: parseDependencies(),
        style: [
            { selector: 'node', style: { 'background-color': '#90caf9', 'label': 'data(label)', 'text-valign': 'center', 'color': '#000' } },
            { selector: 'edge', style: { 'width': 2, 'line-color': '#555', 'target-arrow-color': '#555', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' } }
        ],
        layout: { name: 'dagre', rankDir: 'TB', nodeSep: 40 }
    });

    cy.fit(); // Adjust the viewport
}
