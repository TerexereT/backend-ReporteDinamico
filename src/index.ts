import 'reflect-metadata';
import { createConnection, getConnection } from 'typeorm';
import * as express from 'express';
import { Request, Response } from 'express';
import { Routes } from './routes';
import { preRoutes, posRoutes } from './Middlewares/index';

createConnection()
	.then(async (connection) => {
		// await fs.

		const resp = await getConnection().query(/*sql*/ `
		
		select distinct a.aboTerminal TERMINAL, a.aboCodAfi AFILIADO,b.comerdesc NOMBRE, b.comerRif RIF_CI, c.contTelefMov TLF, g.aliNombres+ ' '+aliApellidos NOMBRES_ACI,  g.aliIdentificacion CEDULA_ACI, g.aliCodigoCelular+ ''+alicelular TLF_ACI   from [dbo].[Historico] as a
join Comercios b on b.comerCod=a.aboCodComercio
join contactos c on c.contCodComer=b.comerCod
join aliados g on g.id=b.comerCodAliado 
where a.hisComisionBancaria > '0.00' and  a.aboterminal not in (select aboterminal from  PlanPago where planId in ('2','5','6','7')) and a.hisFechaEjecucion > GETDATE()-1
ORDER BY a.aboTerminal asc `);

		console.log(resp);

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
			console.log('DB OK');
		});
	})
	.catch((error) => console.log(error));
