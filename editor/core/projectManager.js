export const project = {

files:{
html:"",
css:"",
js:"",
backend:""
},

activeFile:"html"

}

export function updateFile(type,code){

project.files[type]=code

}

export function getFile(type){

return project.files[type]

}
