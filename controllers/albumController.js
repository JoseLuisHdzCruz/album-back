const Album = require('../models/Album');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

// Configuración de Multer para manejar la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Subir imagen a Cloudinary
const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }).end(file.buffer);
  });
};

// Crear un nuevo álbum
exports.createAlbum = async (req, res) => {
    try {
      console.log('Datos recibidos:', req.body); // Log de los datos recibidos
      console.log('Archivo recibido:', req.file); // Log del archivo recibido
  
      const { title, description, date } = req.body;
      const file = req.file;
  
      if (!file) {
        console.error('No se proporcionó un archivo de imagen'); // Log de error
        return res.status(400).json({ message: 'No image file provided' });
      }
  
      console.log('Subiendo imagen a Cloudinary...'); // Log antes de subir la imagen
      const result = await uploadImage(file);
      console.log('Imagen subida a Cloudinary:', result); // Log del resultado de Cloudinary
  
      const newAlbum = new Album({
        title,
        description,
        date,
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
  
      console.log('Guardando álbum en la base de datos...'); // Log antes de guardar en la base de datos
      await newAlbum.save();
      console.log('Álbum guardado:', newAlbum); // Log del álbum guardado
  
      res.status(201).json(newAlbum);
    } catch (err) {
      console.error('Error en createAlbum:', err); // Log de errores
      res.status(500).json({ message: err.message });
    }
  };

// Obtener todos los álbumes
exports.getAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener un álbum por ID
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Actualizar un álbum
exports.updateAlbum = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    album.title = title || album.title;
    album.description = description || album.description;
    album.date = date || album.date;

    if (req.file) {
      const result = await uploadImage(req.file);
      album.imageUrl = result.secure_url;
      album.publicId = result.public_id;
    }

    await album.save();
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Eliminar un álbum
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    await cloudinary.uploader.destroy(album.publicId);
    await album.remove();
    res.status(200).json({ message: 'Album deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Exportar la configuración de Multer
exports.upload = upload;