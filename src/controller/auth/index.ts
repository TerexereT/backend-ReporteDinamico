import { Request, Response } from 'express';
import * as path from 'path';
import { getRepository } from 'typeorm';
import Usuarios from '../../db/models/Usuarios';
import { exec } from 'child_process';
import saveLogs from '../logs';
import createToken from '../token';
import { isUndefined } from 'util';
import UsuarioXWork from '../../db/models/UsuarioXWork';
import { getPermiss, getViews } from './formatData';
import Permissions from '../../db/models/Permissions';
//import { authenticate } from 'ldap-authentication';

function execCommand(cmd: string, password: string) {
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.warn(error);
			}
			resolve(stdout ? stdout : stderr);
		});
	});
}

interface body {
	user: string;
	password: string;
}

interface msg {
	message: string;
	user: any;
	access_token?: string;
}

export const base: string = path.resolve('static');

export default class Auth {
	async login(req: Request<body>, res: Response<msg>) {
		try {
			const { user, password }: { user: string; password: string } = req.body;
			if (!user || !password) throw { message: 'Debe ingresar usuario y contrasena' };

			const encriptPass = await execCommand(`java -jar java.encript/java.jar ${password}`, password);

			//console.log('pass', encriptPass);

			const resUser = await getRepository(Usuarios).findOne({
				where: {
					login: user,
					contrasena: encriptPass,
				},
			});

			if (!resUser) throw { message: 'Correo o Contraseña incorrecta', code: 401 };

			const resWork = await getRepository(UsuarioXWork).findOne({
				where: { id_usuario: resUser.id },
				relations: [
					'id_department',
					'id_rol',
					'id_department.access_views',
					'id_department.access_views.id_views',
				],
			});

			if (!resWork) throw { message: 'Este usuario no tiene acceso a reporte dinamico', code: 401 };

			const { id_rol, id_department: dep }: any = resWork;
			const { access_views, ...id_department }: any = dep;

			if (!id_department.active)
				throw { message: `El departamento de ${id_department.name} esta Bloqueado`, code: 401 };
			const views = getViews(access_views); //obtener lista de vistas

			let permiss: any = [];

			//buscar permisos
			if (id_department.id !== 1) {
				const resPermiss = await getRepository(Permissions).find({
					where: { id_department: id_department.id, id_rol: id_rol.id },
					relations: ['id_action'],
				});
				if (!resPermiss) throw { message: 'Error Access Permisses', code: 400 };

				permiss = getPermiss(resPermiss);

				//console.log(permiss);
			} else {
				console.log('usuario no posee nigun deparmento');
			}

			console.log('rol:', id_rol, 'dep:', id_department);

			const token: string = createToken(resUser.id, resUser.email, id_department.id, id_rol.id);

			//save in log
			await saveLogs(resUser.email, 'POST', '/auth/login', `Login de Usuario`);

			const userRes = {
				login: resUser.login,
				name: resUser.nombre,
				id_department,
				id_rol,
			};

			const info = {
				user: userRes,
				views,
				permiss,
			};

			res.status(200).json({ message: 'login', ...info, access_token: token });
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	}

	async getLogin(req: Request<any, msg, body>, res: Response<msg>) {
		try {
			const { id, email }: any = req.headers.token;

			const resUser = await getRepository(Usuarios).findOne(id);

			if (!resUser) throw { message: 'Usuario no existe' };

			const resWork = await getRepository(UsuarioXWork).findOne({
				where: { id_usuario: resUser.id },
				relations: [
					'id_department',
					'id_rol',
					'id_department.access_views',
					'id_department.access_views.id_views',
				],
			});

			if (!resWork) throw { message: 'Este usuario no tiene acceso a reporte dinamico', code: 401 };

			const { id_rol, id_department: dep }: any = resWork;
			const { access_views, ...id_department }: any = dep;

			if (!id_department.active)
				throw { message: `El departamento de ${id_department.name} esta Bloqueado`, code: 401 };
			const views = getViews(access_views); //obtener lista de vistas

			let permiss: any = [];

			//buscar permisos
			if (id_department.id !== 1) {
				const resPermiss = await getRepository(Permissions).find({
					where: { id_department: id_department.id, id_rol: id_rol.id },
					relations: ['id_action'],
				});
				if (!resPermiss) throw { message: 'Error Access Permisses', code: 400 };

				permiss = getPermiss(resPermiss);

				//console.log(permiss);
			} else {
				console.log('usuario no posee nigun deparmento');
			}

			console.log('rol:', id_rol, 'dep:', id_department);

			const userRes = {
				login: resUser.login,
				name: resUser.nombre,
				id_department,
				id_rol,
			};

			const info = {
				user: userRes,
				views,
				permiss,
			};

			res.status(200).json({ message: 'Usuario', ...info });
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	}
}