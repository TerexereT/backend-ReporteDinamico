import { Request, Response } from 'express';
import { selectQuery, FormatQuery, selects } from '../functions/CancelarCuotas';
import { DateTime } from 'luxon';
import { getConnection } from 'typeorm';

interface body {
	keys: string[];
	terminal: any;
}

interface Querys {
	init: string;
	end: string;
}

interface msg {
	message: string;
	info: any;
}

export default class CancelarCuotas {
	async all(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const { keys } = req.body;

			// formateamos la data
			const selects = selectQuery(keys);
			const sql = FormatQuery(selects, req.body.terminal);

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

	async dicom(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			// ejecucion del querys ya formateado
			const info = await getConnection().query(
				`(SELECT * FROM OPENQUERY([POSTILION_7019],'SELECT TOP 6 id, valorVenta FROM [rep_post_dia].[dbo].[tasas_dicom] WHERE valorVenta NOT IN (0) ORDER BY id DESC'))`
			);

			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	}

	async update(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			console.log('req.body', req.body);

			const { MONTOCOMISION, IVA, FECHPROCESO }: any = req.body;

			console.log(`
			UPDATE [dbo].[PlanCuota]

				SET
					 [montoComision] = ${MONTOCOMISION},
					[montoIVA] = ${IVA},
					[estatusId] = 27,
					[fechaProceso] = '${DateTime.now().toSQLDate()}'

					WHERE aboTerminal = '${req.body.terminal}' AND fechaProceso = '${DateTime.fromISO(FECHPROCESO).toSQLDate()}'
			GO`);

			// ejecucion del querys ya formateado
			const info = await getConnection().query(
				`
				UPDATE [dbo].[PlanCuota]

					SET
					 	[montoComision] = ${MONTOCOMISION},
						[montoIVA] = ${IVA},
						[estatusId] = 27,
						[fechaProceso] = '${DateTime.now().toSQLDate()}'

					WHERE aboTerminal = '${req.body.terminal}' AND fechaProceso = '${DateTime.fromISO(FECHPROCESO).toSQLDate()}'
				GO`
			);

			console.log('info', info);

			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	}
}
