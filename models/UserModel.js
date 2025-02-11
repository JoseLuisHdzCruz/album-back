const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Esquema del Usuario
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    secondLastName: { type: String, default: "" }, // Opcional
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profilePicture: { type: String, default: "" }, // URL de la imagen
    comments: [
      {
        albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album" }, // Referencia al álbum
        comment: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    themePreference: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

// Middleware para cifrar la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Exportar el modelo
module.exports = mongoose.model("User", userSchema);
