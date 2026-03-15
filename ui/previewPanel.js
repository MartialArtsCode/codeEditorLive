import { project } from "../core/projectManager.js";
import { render } from "../core/renderer.js";

const preview = document.getElementById("preview");

/*
 * Initialize preview environment
 */
export function initPreview() {
    render();
}

/*
 * Force preview refresh
 */
export function refreshPreview() {
    render();
}

/*
 * Return iframe document
 * Useful for DOM inspection
 */
export function getPreviewDocument() {
    return preview.contentDocument || preview.contentWindow.document;
}

/*
 * Return iframe window
 * Useful for debugging console execution
 */
export function getPreviewWindow() {
    return preview.contentWindow;
}

/*
 * Execute code inside preview
 */
export function runInPreview(code) {
    const win = getPreviewWindow();
    if (win) {
        win.eval(code);
    }
}

/*
 * Clear preview completely
 */
export function clearPreview() {
    preview.srcdoc = "";
}

/*
 * Inspect DOM structure inside preview
 */
export function inspectDOM() {
    const doc = getPreviewDocument();
    if (!doc) return;

    function walk(node, depth = 0) {
        console.log(`${" ".repeat(depth * 2)}${node.nodeName.toLowerCase()}`);
        node.childNodes.forEach(child => walk(child, depth + 1));
    }

    walk(doc.body);
}

/*
 * Optional auto refresh loop
 */
setInterval(() => {
    render();
}, 500);
