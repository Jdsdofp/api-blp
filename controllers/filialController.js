const Empresa = require("../models/Empresa");
const Filial = require("../models/Filial");

module.exports.registrarFilial = async(req, res)=>{
    try {
        const {
            f_nome,
            f_cnpj,
            f_cidade,
            f_uf,
            f_responsavel_id,
            f_empresa_id,
            f_endereco
        } = req.body;

        if(f_uf.length <=1 ) return res.status(401).json({message: 'Campo (UF) não pode ser menor que 2 caracteres'})
        if(f_cnpj.length < 14 ) return res.status(401).json({message: 'CNPJ invalido'})
        
            const filial = await Filial.create({f_nome: f_nome, f_cnpj: f_cnpj, f_cidade: f_cidade, f_uf: f_uf, f_responsavel_id: f_responsavel_id, f_empresa_id: f_empresa_id, f_endereco: f_endereco})

        res.status(200).json(filial)
    } catch (error) {
        res.status(400).json({message: error.errors[0].message})        
    }
}

module.exports.listarFiliais = async (req, res)=>{
    try {
        const filial = await Filial.findAll()

        res.status(200).json(filial)
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports.listarFilial = async (req, res) =>{
    try {
        const {e_id} = req.params;
        
        const filial = await Filial.findAll({where: {f_empresa_id: e_id }})


        res.status(200).json(filial)
    } catch (error) {
        res.status(400).json({error: "Informe uma empresa"})
    }
}


module.exports.listarEmpresaComFiliais = async (req, res) => {
    try {
        const { e_id } = req.params;

        const empresa = await Empresa.findOne({
            where: { e_id },
            include: [{
                model: Filial,
                as: 'filiais' 
            }]
        });

        if (!empresa) {
            return res.status(404).json({ error: "Empresa não encontrada" });
        }

        res.status(200).json(empresa);
    } catch (error) {
        console.error("Erro ao buscar empresa e filiais:", error); // Log detalhado
        res.status(400).json({ error: "Ocorreu um erro ao buscar a empresa e suas filiais" });
    }
};


