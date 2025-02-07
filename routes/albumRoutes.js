const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');

// Importar la configuración de Multer
const upload = albumController.upload;

// Rutas
router.post('/', upload.single('image'), albumController.createAlbum);
router.get('/', albumController.getAlbums);
router.get('/:id', albumController.getAlbumById);
router.put('/:id', upload.single('image'), albumController.updateAlbum);
router.delete('/:id', albumController.deleteAlbum);

module.exports = router;