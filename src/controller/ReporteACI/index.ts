import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { FormatQuery, selectQuery, selects } from '../../functions/ReporteACI';

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

interface ACIxClient {
	CLIENTNOMBRES?: string;
	MONTOTOTAL_BS: number;
	CANT_CUOTAS: string;
	ACINOMBRES: string;
	MONTOTOTAL: number;
	TERMINAL?: string;
	AFILIADO?: string;
	ESTATUS: string;
	MONTO: number;
	IVA: number;
}

export default class ReporteACI {
	async all(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const keys = selects.map((val) => {
				return val.key;
			});

			// formateamos la data
			const selects2 = selectQuery(keys);

			const sql = FormatQuery(selects2);

			// ejecucion del querys ya formateado
			const info = await getConnection().query(sql);
			for (let index = 0; index < info.length; index++) {
				const {
					aci_nombre,
					cli_nombre,
					aboTerminal,
					afiliado,
					monto,
					iva,
					mont_total,
					estatus,
					monto_total_bs,
					CANT_TRANSACCION,
				} = info[index];

				if (cli_nombre === 'CLIENTES') {
					info[index] = {
						CLIENTNOMBRES: 'Clientes',
						CANT_CUOTAS: CANT_TRANSACCION,
						ACINOMBRES: aci_nombre,
						TERMINAL: aboTerminal,
						AFILIADO: afiliado,
						MONTO: monto,
						IVA: iva,
						MONTOTOTAL: mont_total,
						MONTOTOTAL_BS: monto_total_bs,
						ESTATUS: estatus,
					};
				} else {
					info[index] = {
						CLIENTNOMBRES: cli_nombre,
						CANT_CUOTAS: CANT_TRANSACCION,
						ACINOMBRES: '',
						TERMINAL: aboTerminal,
						AFILIADO: afiliado,
						MONTO: monto,
						IVA: iva,
						MONTOTOTAL: mont_total,
						MONTOTOTAL_BS: monto_total_bs,
						ESTATUS: estatus,
					};
				}
				// formateando con key names
			}
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
