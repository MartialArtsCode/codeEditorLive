import { project } from "../core/projectManager.js";

require.config({
    paths: { vs: "https://unpkg.com/monaco-editor@0.45.0/min/vs" }
});

require(["vs/editor/editor.main"], () => {
    const editor = monaco.editor.create(document.getElementById("editor"), {
        value: project.files.html,
        language: "html",
        theme: "vs-dark",
        automaticLayout: true, // important
        tabSize: 4
    });

    editor.onDidChangeModelContent(() => {
        project.files[project.active] = editor.getValue();
    });
});
