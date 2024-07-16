// Middleware para verificar acesso à empresa
function verificarAcessoEmpresa(req, res, next) {
    const empresaId = req.user.empresas_ids[0]; // Pega o primeiro ID da lista (pode ser ajustado conforme a lógica necessária)

    if (req.user.empresas_ids.includes(empresaId)) {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado à empresa.' });
    }
}

// Middleware para verificar acesso à filial
function verificarAcessoFilial(req, res, next) {
    const filialId = req.user.filiais_ids[0]; // Pega o primeiro ID da lista (pode ser ajustado conforme a lógica necessária)

    if (req.user.filiais_ids.includes(filialId)) {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado à filial.' });
    }
}

module.exports = { verificarAcessoEmpresa, verificarAcessoFilial };
