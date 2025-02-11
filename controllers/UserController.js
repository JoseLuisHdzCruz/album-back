const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

// Función para generar un token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Registro de Usuario
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, secondLastName, username, email, password, dateOfBirth } = req.body;

    // Verificar si el correo o nombre de usuario ya existen
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "El correo o nombre de usuario ya están en uso." });
    }

    // Crear el nuevo usuario
    const newUser = new User({
      firstName,
      lastName,
      secondLastName,
      username,
      email,
      password,
      dateOfBirth,
    });

    await newUser.save();

    // Generar token JWT
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "Usuario registrado exitosamente.",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario.", error });
  }
};

// Inicio de Sesión
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Comparar contraseñas
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    // Generar token JWT
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión.", error });
  }
};

// Agregar Comentario a un Álbum
exports.addComment = async (req, res) => {
  try {
    const { userId, albumId, comment } = req.body;

    // Buscar al usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Agregar el comentario
    user.comments.push({ albumId, comment });
    await user.save();

    res.status(200).json({ message: "Comentario agregado exitosamente.", comment });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el comentario.", error });
  }
};

// Actualizar Preferencias del Usuario
exports.updatePreferences = async (req, res) => {
  try {
    const { userId, themePreference, notificationsEnabled } = req.body;

    // Buscar al usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Actualizar preferencias
    user.themePreference = themePreference || user.themePreference;
    user.notificationsEnabled = notificationsEnabled !== undefined ? notificationsEnabled : user.notificationsEnabled;

    await user.save();

    res.status(200).json({ message: "Preferencias actualizadas exitosamente.", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar las preferencias.", error });
  }
};