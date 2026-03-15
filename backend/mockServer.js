const routes={

"/api/users":()=>{

return JSON.stringify([
{name:"Alice"},
{name:"Bob"}
])

}

}

const originalFetch=window.fetch

window.fetch=async(url,options)=>{

if(routes[url]){

return{

json:async()=>JSON.parse(routes[url]())

}

}

return originalFetch(url,options)

}
