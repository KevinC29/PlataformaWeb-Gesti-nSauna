import express from 'express';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const pathRouter = `${__dirname}`;

const removeExtension = (fileName) => {
    return fileName.split('.').shift();
};

const cleanRouteName = (fileName) => {
    return fileName.replace('Routes', '');
};

// Middleware para registrar cada solicitud
// router.use((req, res, next) => {
//     console.log(`Solicitando URL: ${req.method} ${req.originalUrl}`);
//     next();
// });

// Cargar y usar rutas
fs.readdirSync(pathRouter).filter((file) => {
    const fileWithOutExt = removeExtension(file);
    const skip = ['index'].includes(fileWithOutExt);
    if (!skip) {
        const routeName = cleanRouteName(fileWithOutExt);
        import(`./${fileWithOutExt}.js`)
            .then((module) => {
                if (module.default) {
                    router.use(`/${routeName}`, module.default);
                    // console.log(`Ruta cargada: /${routeName}`);
                } else {
                    // console.error(`El archivo ./${fileWithOutExt}.js no está exportando un router por defecto.`);
                }
            })
            .catch((err) => {
                console.error('Error al cargar la ruta:', err);
            });
    }
});

export default router;
