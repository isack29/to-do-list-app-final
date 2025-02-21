const express = require("express");
const path = require("path");

const app = express();

// Servir archivos estáticos de la carpeta dist
app.use(express.static(path.join(__dirname, "dist/todolist-frontend")));

// Redirigir todas las rutas al index.html de Angular
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/todolist-frontend/browser/index.html"));
});

// Puerto de Railway o 3000 en local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Frontend running on port ${PORT}`);
});