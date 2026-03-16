require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs' } });

let monacoEditor = null;

function initMonaco() {
  if (isMobile) return;
  require(['vs/editor/editor.main'], () => {
    if (monacoEditor) monacoEditor.dispose();
    if (!currentFile) return;

    monacoEditor = monaco.editor.create(document.getElementById('editor-container'), {
      value: files[currentFile] || '',
      language: getLanguage(currentFile),
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      tabSize: 2
    });

    monacoEditor.onDidChangeModelContent(() => {
      if (currentFile) {
        files[currentFile] = monacoEditor.getValue();
        debounceSave();
        updatePreview();
        updateGraph();
      }
    });
  });
}

function initFallbackTextarea() {
  if (!isMobile) return;
  const ta = document.getElementById('fallback-textarea');
  ta.value = files[currentFile] || '';
  ta.oninput = () => {
    if (currentFile) {
      files[currentFile] = ta.value;
      debounceSave();
      updatePreview();
      updateGraph();
    }
  };
  ta.onblur = () => hljs.highlightElement(ta);
}