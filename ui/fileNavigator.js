import {project} from "../core/projectManager.js"

const nav=document.getElementById("navigator")

const files=["html","css","js","backend"]

files.forEach(file=>{

  const btn=document.createElement("button")

  btn.innerText=file

  btn.onclick=()=>{

    project.active=file

    editor.setValue(project.files[file])

    if(file==="html")
      monaco.editor.setModelLanguage(editor.getModel(),"html")

    if(file==="css")
      monaco.editor.setModelLanguage(editor.getModel(),"css")

    if(file==="js")
      monaco.editor.setModelLanguage(editor.getModel(),"javascript")

  }

  nav.appendChild(btn)

})
