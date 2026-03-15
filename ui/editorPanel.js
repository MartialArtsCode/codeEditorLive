const editor = document.getElementById("editor");

editor.addEventListener("keydown", function(e) {

    if (e.key === "Tab") {
        e.preventDefault();

        const start = this.selectionStart;
        const end = this.selectionEnd;

        this.value =
            this.value.substring(0, start) +
            "    " +
            this.value.substring(end);

        this.selectionStart = this.selectionEnd = start + 4;
    }

});

import {project,updateFile} from "../core/projectManager.js"

const editor=document.getElementById("editor")

editor.addEventListener("input",()=>{

updateFile(project.activeFile,editor.value)

})
