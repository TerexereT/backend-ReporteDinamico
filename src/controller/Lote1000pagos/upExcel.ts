import { Request, Response } from 'express';
import * as path from 'path';
//
import { getRepository } from 'typeorm';
import Historico_Contracargo from '../../db/models/Historico_Contracargo';

interface Lote {
	Terminal: string;
	'Monto de Cuota ($)': number;
}

interface body {
	lote: string;
}

interface Querys {
	init: string;
	end: string;
}

interface msg {
	message: string;
	//info: any;
}

export const base: string = path.resolve('static');

export default class upExcel {
	async upFile(req: Request<body>, res: Response<msg>) {
		try {
			if (!req.body.lote) throw { message: 'No se encontro ningun lote' };

			const lote = JSON.parse(req.body.lote);

			//console.log(lote);

			lote.forEach(async (item: Lote, index: number) => {
				const terminal = await getRepository(Historico_Contracargo).findOne({ TERMINAL: item.Terminal });
				if (terminal) {
					//update
					let suma = terminal.MONTO_COBRA + item['Monto de Cuota ($)'];

					//console.log(item.Terminal, 'sumar: ', terminal.MONTO_COBRA, '+', item['Monto de Cuota ($)'], ':', suma);
					await getRepository(Historico_Contracargo).update(terminal.ID, {
						MONTO_COBRA: suma,
					});
				} else {
					//save

					//console.log('save', item.Terminal, '/', item['Monto de Cuota ($)']);
					await getRepository(Historico_Contracargo).save({
						TERMINAL: item.Terminal,
						MONTO_COBRA: item['Monto de Cuota ($)'],
					});
				}
				//console.log(index, item);
			});

			res.status(200).json({ message: 'File Saved' });
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	}

	/*
	async keys(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			let info: any = {};
			selects.forEach((item: any) => {
				const { key }: any = item;

				info[key] = true;
			});
			res.status(200).json({ message: 'keys devueltas', info });
		} catch (err) {
			res.status(400).json(err);
		}
	}
  */
}
