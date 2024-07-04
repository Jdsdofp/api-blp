function settingsServer(pkg, PORT){
    return `Aplication: ${pkg.description}\nHost: http://localhost:${PORT}\nVersion: ${pkg.version}\nServer: ${Object.keys(pkg.dependencies)[0]} V${pkg.dependencies["express"]}`
}

function msgErros(err){
    
    if(String(err).includes("unique")) return "Email ja cadastrado"
    
}

module.exports = {settingsServer, msgErros};