const DocumentoCondicionante = require("../models/Documento_Condicionante");
const Documento = require("../models/Documentos");
const Filial = require("../models/Filial");
  
  
module.exports.listarDocumentoCondicionantes = async (req, res)=>{
    try {
        const documentoCondicionante = await DocumentoCondicionante.findAll({order: [['dc_id', 'ASC']]})

        res.status(200).json(documentoCondicionante)
    } catch (error) {
        res.status(400).json(error);
    }
}

//Listar documento condicionante por filial
module.exports.listarDocumentoCondicionanteFiliais = async (req, res) => {
    try {
        const documentoCondicionante = await DocumentoCondicionante.findAll({
            include: [
                {
                    model: Documento,
                    as: 'documento', // Usar o alias 'documento' definido no belongsTo
                    attributes: ['d_filial_id'], // Inclui o ID da filial relacionado ao documento
                    include: [
                        {
                            model: Filial,
                            as: 'filiais', // Usar o alias 'filiais' definido no belongsTo no Documento
                            attributes: ['f_nome', 'f_cnpj', 'f_cidade', 'f_uf'], // Pegue os dados da filial
                        }
                    ]
                }
            ]
        });

        res.status(200).json(documentoCondicionante);
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
};

module.exports.listarDocumentoCondicionante = async (req, res)=>{

    const {dc_id} = req.params;
    try {
        const documentoCondicionante = await DocumentoCondicionante.findOne({where: {dc_id: dc_id}})

        res.status(200).json(documentoCondicionante)
    } catch (error) {
        res.status(400).json(error);
    }
}

module.exports.fecharCondicionante = async (req, res) => {
    try {
        const { dc_id } = req.params;
        const { dc_condicoes } = req.body;

        // Obter a primeira chave do objeto dc_condicoes
        const firstKey = Object.keys(dc_condicoes)[0];

        // Buscar o documento com o dc_id
        const doc_cond = await DocumentoCondicionante.findOne({ where: { dc_id: dc_id } });

        if (!doc_cond) {
            return res.status(404).json({ message: 'Documento não encontrado.' });
        }

        // Verifique se a primeira chave existe em dc_condicoes do banco de dados
        const conditionExists = firstKey in doc_cond.dataValues.dc_condicoes;

        if (conditionExists) {
            console.log(`Condição '${firstKey}' existe no documento.`);

            // Atualizar a condição no objeto dc_condicoes do documento encontrado
            doc_cond.dataValues.dc_condicoes[firstKey] = dc_condicoes[firstKey];

            // Persistir a alteração no banco de dados
            await DocumentoCondicionante.update(
                { dc_condicoes: doc_cond.dataValues.dc_condicoes },
                { where: { dc_id: dc_id } }
            );

            return res.status(200).json({ message: `Condição '${firstKey}' atualizada com sucesso.` });
        } else {
            console.log(`Condição '${firstKey}' não existe no documento.`);
            return res.status(404).json({ message: `Condição '${firstKey}' não encontrada no documento.` });
        }
    } catch (error) {
        console.error('Houve um erro aqui', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

