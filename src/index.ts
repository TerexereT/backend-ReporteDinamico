import 'reflect-metadata';
import { createConnection, getConnection } from 'typeorm';
import * as express from 'express';
import { Request, Response } from 'express';
import { Routes } from './routes';
import { preRoutes, posRoutes } from './Middlewares/index';

createConnection()
	.then(async (connection) => {
		// await fs.

		// create express app
		const app = express();
		app.use(express.json());

		preRoutes(app);

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
		});

		console.log('DB OK  -->');
	})
	.catch((error) => console.log(error));
