const routes={

"/api/users":()=>{

return JSON.stringify([
{name:"Alice"},
{name:"Bob"},
{name:"Charlie"}
])

}

}

const originalFetch=window.fetch

window.fetch=async(url)=>{

  if(routes[url]){

    return{
      json:async()=>JSON.parse(routes[url]())
    }

  }

  return originalFetch(url)

}
