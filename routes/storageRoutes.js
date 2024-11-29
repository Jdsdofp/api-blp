// routes/storageRoutes.js
const express = require('express');
const storageRoutes = express.Router()
const multer = require('multer'); // Middleware para lidar com uploads
const storageController = require('../controllers/storageController');
const authMiddleware = require('../config/authMiddleware');

const upload = multer(); // Configura o multer para receber arquivos na memória

// Rotas
storageRoutes.post('/upload/:d_id', authMiddleware, upload.single('file'), storageController.uploadFile);
storageRoutes.get('/list', storageController.listFiles);
storageRoutes.get('/url/:fileName', storageController.getFileUrl);

module.exports = storageRoutes;
