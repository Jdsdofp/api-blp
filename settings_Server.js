function settingsServer(pkg, PORT){
    var result = [{'Aplication': pkg.description, 'Host': `http://localhost:${PORT}`, 'Version': pkg.version, 'Server': `V${pkg.dependencies["express"]}`}]
    // return `Aplication: ${pkg.description}\nHost: http://localhost:${PORT}\nVersion: ${pkg.version}\nServer: V${pkg.dependencies["express"]}`
       return result
}   

function msgErros(err){
    
    if(String(err).includes("unique")) return "Email ja cadastrado"
    
}

module.exports = {settingsServer, msgErros};