import { Request, Response } from 'express';
import { FormatQuery, selectQuery, selects } from '../../functions/mantenimineto/plan_comision_inactivo';
// @ts-ignore
import { getConnection } from 'typeorm';

interface body {
	keys: string[];
}

interface Querys {
	init: string;
	end: string;
}

interface msg {
	message: string;
	info: any;
}

export default {
	async all(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			// definimos variables
			const { keys } = req.body;

			// formateamos la data
			const selects = selectQuery(keys);
			const query = FormatQuery(selects);

			// ejecucion del querys ya formateado
			// const resp: any = await getConnection().query(query);
			const info: any = await getConnection().query(query);

			// retornar data al cliente
			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},

	async keys(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			let keys: any = {};
			selects.forEach((item: any) => {
				const { key }: any = item;

				keys[key] = key === 'TERMINAL';
			});

			const { TERMINAL, ...resto } = keys;

			const info: any = { TERMINAL, ...resto };

			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},
};
