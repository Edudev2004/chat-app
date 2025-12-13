const express = require("express");

const app = express();
const PORT = 5000;

// Middleware básico
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

app.get("/api/status", (req, res) => {
    res.json({
        status: "online",
        message: "Servidor listo para el chat",
        timestamp: new Date().toISOString()
    });
});

app.get("/api/saludo/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    res.json({
        mensaje: `¡Hola ${nombre}!`,
        instruccion: "Bienvenido al sistema de chat en tiempo real",
        endpoints: {
            principal: "/",
            estado: "/api/status",
            saludo: "/api/saludo/:nombre"
        }
    });
});

// Levantando servidor
app.listen(PORT, () => {
    console.log(`Servidor backend iniciado en el puerto ${PORT}`);
});