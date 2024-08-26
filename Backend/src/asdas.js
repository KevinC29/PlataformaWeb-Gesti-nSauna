
//compression permite comprimir las respuestas del servidor
const compression = require('compression');
//json permite recibir y enviar datos en formato json
const bodyParser = require('body-parser');
//permite resolver errores de origen cruzado
const cors = require('cors');

//middlewares
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

