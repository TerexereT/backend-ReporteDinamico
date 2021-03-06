import * as express from 'express';
import { Request, Response } from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { posRoutes, preRoutes } from './Middlewares/index';
import { Routes } from './routes';
require('dotenv').config();

//
var fileupload = require('express-fileupload');

const { HOST, USER, PASS, DB } = process.env;

createConnection()
	//
	.then(async (connection) => {
		// create express app
		const app = express();
		app.use(express.json());

		preRoutes(app);

		app.use(fileupload());
		app.use(express.urlencoded({ extended: true }));

		// register express routes from defined application routes
		Routes.forEach((route) => {
			(app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
				const result = new (route.controller as any)()[route.action](req, res, next);
				if (result instanceof Promise) {
					result.then((result) => (result !== null && result !== undefined ? res.send(result) : undefined));
				} else if (result !== null && result !== undefined) {
					res.json(result);
				}
			});
		});

		posRoutes(app);

		// setup express app here
		// ...

		// start express server
		app.set('port', process.env.PORT || 4040);

		app.listen(app.get('port'), () => {
			console.log(`app corriendo en el puerto http://localhost:${app.get('port')} `);
			console.log('            ()_()');
			console.log(`            (o.o)`);
			console.log('            (|_|)*');
			console.log('DB OK');
		});
		/*
			HOST=10.198.71.45
			USER=reportes_dinamicos
			PASS=R1p0rt3$Din4mic0s339
			DB=milpagos
			PORT=4040
				
		*/
	})
	.catch((error) => console.log(error));
