const express = require("express");
const path = require("path");

const app = express();

// Cambia esta línea para servir los archivos desde "browser"
const frontendPath = path.join(__dirname, "dist", "todolist-frontend", "browser");
app.use(express.static(frontendPath));

// Manejo de rutas de Angular
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});