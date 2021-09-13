import { Request, Response } from 'express';
import { selectQuery, dateRang, FormatQuery } from '../functions/index';
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
			// date today with in format yyyy-MM-dd luxon js
			const today: string = DateTime.local().toFormat('yyyy-MM-dd');

			// ejecucion del querys ya formateado
			const info = await getConnection().query(/*sql*/ `
			select aboterminal TERMINAL, montoTotal MONTOTOTAL, fechaProceso FECHPROCESO, estatusId ESTATUS
 			from PlanCuota where estatusId in ('25','26') and fechaProceso <='${today} 00:00:00.000'
			`);

			// retornar data al cliente
			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	}

	async keys(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const info: any = {
				TERMINAL: true,
				MONTOTOTAL: true,
				FECHPROCESO: true,
				ESTATUS: true,
			};

			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	}
}
