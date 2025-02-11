const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Registro de Usuario
router.post("/register", UserController.registerUser);

// Inicio de Sesión
router.post("/login", UserController.loginUser);

// Agregar Comentario
router.post("/comment", UserController.addComment);

// Actualizar Preferencias
router.put("/preferences/:userId", UserController.updatePreferences);

module.exports = router;