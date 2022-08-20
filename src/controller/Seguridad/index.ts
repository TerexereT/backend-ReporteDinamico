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
	info?: any;
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
			res.status(400).json(err);
		}
	}

	async allRoles(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const info = await getRepository(Roles).find();

			res.status(200).json({ message: 'roles', info });
		} catch (err) {
			res.status(400).json(err);
		}
	}

	async dataUser(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			console.log('entreeee');
			console.log(req.params);
			//const info = await getRepository(Roles).find();

			res.status(200).json({ message: 'user', info: {} });
		} catch (err) {
			res.status(400).json(err);
		}
	}
}

export const dataUserData = async (req: Request<any, msg, body, Querys>, res: Response<msg>): Promise<void> => {
	try {
		//console.log('dataUserData', req.params);
		const idUser = req.params;
		if (!idUser) throw { message: 'No existe el usuario' };

		let user: any = await getRepository(UsuarioXWork).findOne({
			where: {
				id_usuario: idUser,
			},
			relations: ['id_rol', 'id_department'],
		});

		let info = {};

		if (!user) {
			console.log('No tiene departmento el usuario');
			info = {
				active: 0,
				id_rol: null,
				id_department: null,
			};
		} else {
			info = {
				active: user.active,
				id_rol: user.id_rol,
				id_department: user.id_department,
			};
		}

		console.log(info);

		res.status(200).json({ message: 'user', info });
	} catch (err) {
		res.status(400).json(err);
	}
};

export const updateUserData = async (req: Request<any, msg, body, Querys>, res: Response<msg>): Promise<void> => {
	try {
		const idUser = req.params;
		console.log(idUser);
		const { id_rol, id_department, block }: any = req.body;

		if (!id_rol || !id_department) throw { message: 'Faltan departamento o rol' };

		const user: any = await getRepository(UsuarioXWork).findOne({
			where: {
				id_usuario: idUser,
			},
		});

		if (user) {
			//update

			await getRepository(UsuarioXWork).update(user.id, {
				id_rol: id_rol,
				id_department: id_department,
				active: block ? 0 : 1,
			});
		} else {
			//save
			await getRepository(UsuarioXWork).save({
				id_usuario: idUser,
				id_rol: id_rol,
				id_department: id_department,
				active: block ? 0 : 1,
			});
		}

		//
		res.status(200).json({ message: 'update user' });
	} catch (err) {
		res.status(400).json(err);
	}
};
