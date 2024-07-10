function settingsServer(pkg, PORT){
    var result = [{'Aplication': pkg.description, 'Host': `http://localhost:${PORT}`, 'Version': pkg.version, 'Server': `V${pkg.dependencies["express"]}`}]
    // return `Aplication: ${pkg.description}\nHost: http://localhost:${PORT}\nVersion: ${pkg.version}\nServer: V${pkg.dependencies["express"]}`
       return result
}   

function msgErrosUnico(err){
    
    if(String(err).includes("unique")) return "ja cadastrado (a)"
    
}

module.exports = {settingsServer, msgErrosUnico};