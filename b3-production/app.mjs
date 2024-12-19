import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan'; 
import router from './src/backend/router.mjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import Socket from './src/backend/socket.mjs';
import cors from 'cors';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: '*', credentials: true }));

const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');


function setModuleMimeType(req, res, next) {
    if (req.url.endsWith('.mjs') || req.url.endsWith('.js')) {
        res.type('application/javascript');
    } else if (req.url.endsWith('.css')) {
        res.type('text/css');
    } else if (req.url.endsWith('.html')) {
        res.type('text/html');
    }
    next();
}
app.use(setModuleMimeType);

app.use('/socket.io-client', express.static('node_modules/socket.io-client/dist'));
app.use("/node_modules", express.static('node_modules'));
app.use("/favicon.ico", express.static('public/favicon.ico'));
app.use('/js', express.static('src/frontend/js'));
app.use('/css', express.static('src/frontend/css'));
app.use('/html', express.static('src/frontend'));
app.use('/public', express.static('public'));

app.use(router);

const httpServer = createServer(app);
Socket.init(httpServer);

// Start the server
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

