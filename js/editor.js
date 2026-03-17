require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs' } });

let monacoEditor = null;

function initMonaco() {
    // Exit if on mobile or no current file
    if (isMobile || !currentFile) return;

    require(['vs/editor/editor.main'], () => {
        // Dispose of previous editor instance if exists
        if (monacoEditor) monacoEditor.dispose();

        // Create new Monaco editor instance
        monacoEditor = monaco.editor.create(document.getElementById('editor-container'), {
            value: files[currentFile] || '',
            language: getLanguage(currentFile),
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            tabSize: 2
        });
        window.monacoEditor = monacoEditor;

        // Handle content change events
        monacoEditor.onDidChangeModelContent(() => {
            updateFileContent();
        });
    });
}

function initFallbackTextarea() {
    // Initialize fallback textarea for mobile
    if (!isMobile) return;

    const ta = document.getElementById('fallback-textarea');
    ta.value = files[currentFile] || '';

    ta.oninput = () => {
        updateFileContent(ta.value);
    };

    ta.onblur = () => {
        hljs.highlightElement(ta);
    };
}

// Function to update file content and trigger necessary actions
function updateFileContent(value) {
    if (currentFile) {
        files[currentFile] = value || monacoEditor.getValue();
        debounceSave();
        updatePreview();
        updateGraph();
    }
}
