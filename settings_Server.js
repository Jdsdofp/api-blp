function settingsServer(pkg, PORT){
    var result = [{'Aplication': pkg.description, 'Host': `http://localhost:${PORT}`, 'Version': pkg.version, 'Server': `V${pkg.dependencies["express"]}`}]
    // return `Aplication: ${pkg.description}\nHost: http://localhost:${PORT}\nVersion: ${pkg.version}\nServer: V${pkg.dependencies["express"]}`
       return result
}   

function msgErrosUnico(err){
    
    if(String(err).includes("unique")) return "ja cadastrado (a)"
    
}

function obterDataAtualFormatada() {
    const data = new Date();

    // Obtém dia, mês e ano
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // O mês começa do zero, por isso adicionamos 1
    const ano = data.getFullYear();

    // Obtém hora e minutos
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    // Formata a data e hora no formato dd/mm/aaaa hh:mm
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

// Exemplo de uso:
const dataHoraAtualFormatada = obterDataAtualFormatada();






module.exports = {settingsServer, msgErrosUnico, obterDataAtualFormatada};