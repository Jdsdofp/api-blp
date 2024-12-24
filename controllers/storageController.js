// controllers/storageController.js
const supabase = require('../config/configStorageSB');
const fs = require('fs');
const Documento = require('../models/Documentos'); // Importa o modelo do Documento

exports.uploadFile = async (req, res) => {
    try {
      const bucketName = 'blpdocs';
      const file = req.file;
      const { d_id } = req.body; // Recebe o ID do documento do corpo da requisição
     
        
     //console.log('ID d', d_id)

      if (!d_id) {
        return res.status(400).json({ error: 'ID do documento (d_id) é obrigatório' });
      }
  
      // Nome único para o arquivo com codificação para URL
      const filePath = `${Date.now()}`;


      //console.log('File path gerado:', filePath);
  
      // Upload do arquivo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype, // Tipo de conteúdo
          upsert: false, // Evitar sobrescrita
        });
  
      if (uploadError) {
        console.error('Upload Error:', uploadError);
        return res.status(400).json({ error: uploadError.message });
      }
  
      // Obter a URL pública do arquivo
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
  
      if (urlError) {
        console.error('URL Error:', urlError);
        return res.status(400).json({ error: urlError.message });
      }
  
      const fileUrl = publicUrlData.publicUrl;
  
      // Atualizar o campo `d_anexo` no banco de dados
      const documento = await Documento.findByPk(d_id);
      if (!documento) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }
  
      documento.d_anexo = fileUrl; // Atualiza o campo `d_anexo`
      documento.d_anexo = {
        arquivo: file.originalname,
        url: publicUrlData.publicUrl
      }
      await documento.save(); // Salva no banco de dados
  
      // Resposta com sucesso
      res.status(200).json({
        message: 'Arquivo enviado e associado ao documento com sucesso!',
        fileUrl,
      });
    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ error: 'Erro no servidor', details: error?.message });
    }
  };

  
  

// Listar arquivos no bucket
exports.listFiles = async (req, res) => {
    try {
      const bucketName = 'blpdocs';
  
      // Listando arquivos no bucket
      const { data, error } = await supabase.storage.from(bucketName).list('', {
        // Adicione filtros se necessário
        // prefix: 'docs/', // Para listar apenas arquivos na pasta 'docs'
        // limit: 10, // Limita a 10 arquivos
      });
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      res.status(200).json({ files: data });
    } catch (error) {
      res.status(500).json({ error: 'Erro no servidor', details: error.message });
    }
  };
  

// Obter URL pública de um arquivo
exports.getFileUrl = async (req, res) => {
  try {
    const { fileName } = req.params;
    const bucketName = 'blpdocs';

    const { publicURL, error } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ url: publicURL });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor', details: error.message });
  }
};
