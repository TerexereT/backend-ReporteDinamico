import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { FormatQuery, selects } from '../../functions/Transaccional';
// @ts-ignore

interface body {
	transType: any;
}

interface Querys {
	transOption: number;
	monthoption: number;
}

interface msg {
	message: string;
	info: any;
}

export const options = ['Aprobados', 'Rechazos', 'CierreDeLote', 'Reversos'];

export const organizations = [
	{ name: 'BVC', value: 0, query: '720%' },
	{ name: 'BNC', value: 1, query: '860%' },
	{ name: 'BPlaza', value: 2, query: '722%' },
	// { name: '1000Pagos BVC', value: 3 },
	// { name: '1000Pagos BPlaza', value: 4 },
];

export default class sin_plan {
	async all(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			// definimos variables
			const { transOption, monthoption } = req.query;
			const { transType } = req.body;
			const tipo = Object.entries(transType)
				.filter(([key, value]) => value)
				.map(([key, value]): string => key);

			// formateamos la data
			const query = FormatQuery(tipo[0], transOption, monthoption);

			// ejecucion del querys ya formateado
			// const resp: any = await getConnection().query(query);
			const info: any = await getConnection().query(query);

			// retornar data al cliente
			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	}

	async options(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			res.status(200).json({ message: 'reporte exitoso', info: organizations });
		} catch (err) {
			res.status(400).json(err);
		}
	}

	async transType(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			let keys: any = {};

			options.forEach((item: any) => {
				if (item === 'Aprobados') {
					keys[item] = true;
				} else {
					keys[item] = false;
				}
			});

			const info: any = keys;

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
				keys[key] = false;
				// keys[key] = key === 'TERMINAL';
			});

			// const { TERMINAL, ...resto } = keys;

			const info: any = keys;

			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	}
}
