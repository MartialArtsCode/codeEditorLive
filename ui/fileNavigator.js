import {project} from "../core/projectManager.js"

const nav=document.getElementById("navigator")

const files=["html","css","js","backend"]

files.forEach(file=>{

const btn=document.createElement("button")

btn.innerText=file

btn.onclick=()=>{

project.activeFile=file

editor.value=project.files[file]

}

nav.appendChild(btn)

})
