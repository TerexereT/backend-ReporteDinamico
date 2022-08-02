import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import Department from '../../db/models/Department';
import Roles from '../../db/models/Roles';
import Usuarios from '../../db/models/Usuarios';
import UsuarioXWork from '../../db/models/UsuarioXWork';
import { FormatQuery, selects } from '../../functions/Transaccional';
// @ts-ignore

interface body {
	transType: any;
}

interface Querys {
	transOption: number;
	monthoption: string;
}

interface msg {
	message: string;
	info: any;
}

export const options = ['Aprobados', 'Rechazos', 'CierreDeLote', 'Reversos'];

export default class Seguridad {
	async allWorker(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			//buscar los usuarios agregados a reporte dinamico

			const users1000pagos = await getRepository(Usuarios).find();

			if (!users1000pagos) throw { message: 'No existen Usuario' };

			const info: any[] = users1000pagos.map((worker: any) => {
				const { contrasena, ...data } = worker;

				return data;
			});

			console.log(info);

			res.status(200).json({ message: 'data del usuario', info });
		} catch (err) {
			//console.log(err);
			res.status(400).json(err);
		}
	}

	async allDepartment(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const info = await getRepository(Department).find();

			res.status(200).json({ message: 'departments', info });
		} catch (err) {
			//console.log(err);
			res.status(400).json(err);
		}
	}

	async allRoles(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const info = await getRepository(Roles).find();

			res.status(200).json({ message: 'roles', info });
		} catch (err) {
			//console.log(err);
			res.status(400).json(err);
		}
	}
}
