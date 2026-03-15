import {project,updateFile} from "../core/projectManager.js"

const editor=document.getElementById("editor")

editor.addEventListener("input",()=>{

updateFile(project.activeFile,editor.value)

})
