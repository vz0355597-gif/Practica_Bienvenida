const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/univive_db')

// 2. Definimos esquema y la base de datos aqui
const bienvenidaSchema = new mongoose.Schema({
    empresa: {
        nombre: String,
        logo: String,
        direccion: String,
        contacto: String
    },
    bienvenida: {
        destinatario: String,
        puesto: String,
        departamento: String,
        mensaje: String,
        remitente: String,
        cargoRemitente: String,
        firma: String
    }
});

const UniviveModel = mongoose.model('BienvenidaUnivive', bienvenidaSchema);

// Ruta para insertar datos de prueba iniciales (puedes llamarla una vez desde Postman o navegador)
app.get('/api/inicializar', async (req, res) => {
    await UniviveModel.deleteMany({});
    const nuevoRegistro = new UniviveModel({
        empresa: {
            nombre: "Univive S.A. de C.V.",
            logo: "logo.jpeg",
            direccion: "Corporativo Univive, Av. Tecnológico #500, Estado de México",
            contacto: "contacto@univive.com | Tel: 55-9876-5432"
        },
        bienvenida: {
            destinatario: "Ing. Zamora Leyva Vanessa Joselin",
            puesto: "Desarrolladora de Software y Sistemas",
            departamento: "Tecnologías de la Información",
            mensaje: "Es un honor darte la más cordial bienvenida a Univive. Tu incorporación representa un gran impulso para nuestros proyectos.",
            remitente: "Lic. Marcela Ruiz Castañeda",
            cargoRemitente: "Directora de Gestión de Talento Univive",
            firma: "marcela.jpg"
        }
    });
    await nuevoRegistro.save();
    res.json({ mensaje: "Base de datos inicializada con éxito en MongoDB" });
});

// 3. Endpoint que entrega los datos en formato JSON
app.get('/api/bienvenida/json', async (req, res) => {
    const datos = await UniviveModel.findOne();
    res.json(datos);
});

// 4. Endpoint que entrega los mismos datos transformados a XML
app.get('/api/bienvenida/xml', async (req, res) => {
    const doc = await UniviveModel.findOne();
    if (!doc) return res.status(404).send("No encontrado");

    // Construimos la estructura XML dinámicamente desde la BD
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<univive>\n`;
    xml += `    <empresa>\n`;
    xml += `        <nombre>${doc.empresa.nombre || ''}</nombre>\n`;
    xml += `        <logo>${doc.empresa.logo || ''}</logo>\n`;
    xml += `        <direccion>${doc.empresa.direccion || ''}</direccion>\n`;
    xml += `        <contacto>${doc.empresa.contacto || ''}</contacto>\n`;
    xml += `    </empresa>\n`;
    xml += `    <bienvenida>\n`;
    xml += `        <destinatario>${doc.bienvenida.destinatario || ''}</destinatario>\n`;
    xml += `        <puesto>${doc.bienvenida.puesto || ''}</puesto>\n`;
    xml += `        <departamento>${doc.bienvenida.departamento || ''}</departamento>\n`;
    xml += `        <mensaje>${doc.bienvenida.mensaje || ''}</mensaje>\n`;
    xml += `        <remitente>${doc.bienvenida.remitente || ''}</remitente>\n`;
    xml += `        <cargoRemitente>${doc.bienvenida.cargoRemitente || ''}</cargoRemitente>\n`;
    xml += `        <firma>${doc.bienvenida.firma || ''}</firma>\n`;
    xml += `    </bienvenida>\n`;
    xml += `</univive>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

// Iniciar servidor en puerto 3000
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});