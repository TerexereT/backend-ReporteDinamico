import { Request, Response } from 'express';
import { selectQuery, dateRang, FormatQuery, selects } from '../functions/history';
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

export default class History {
	async allHistory(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			// definimos variables
			const { keys } = req.body;

			console.log('req.', req.query);

			const { init, end }: any = req.query;

			// formateamos la data
			const Dates = dateRang(init, end);
			const selects = selectQuery(keys);
			const query = FormatQuery({ init, end }, selects);

			// ejecucion del querys ya formateado
			const info: any = await getConnection().query(query);

			// if (keys.includes('TRANSACCION')) {
			// 	const trans: any = await pool.query(transQuery);
			// }

			// const info: any[] = resp.map((item: any) => {
			// 	Object.keys(item).forEach((key: any) => {
			// 		if (typeof item[key] === 'number') {
			// 			item[key] = 'Bs' + numeral(item[key]).format('0.0,00');
			// 		}
			// 	});

			// 	return item;
			// });

			// retornar data al cliente
			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	}

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
	}
}
