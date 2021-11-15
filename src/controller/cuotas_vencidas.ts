import { Request, Response } from 'express';
import { selectQuery, FormatQuery, selects } from '../functions/cuotas_vencidas';
// @ts-ignore
import numeral from 'numeral';
import { DateTime } from 'luxon';
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

export default class Aboterminal {
	async all(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const { keys } = req.body;

			// formateamos la data
			const selects = selectQuery(keys);

			const sql = FormatQuery(selects);

			// ejecucion del querys ya formateado
			const info = await getConnection().query(sql);

			// retornar data al cliente
			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			console.log('err', err);

			res.status(400).json(err);
		}
	}

	async keys(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			// console.log('holaaaaaa keys');

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
