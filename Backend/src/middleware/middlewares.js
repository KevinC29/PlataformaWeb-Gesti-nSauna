import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

export default (app) => {
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
};
