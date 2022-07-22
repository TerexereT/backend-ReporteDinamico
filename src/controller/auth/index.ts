import { Request, Response } from 'express';
import * as path from 'path';
import { getRepository } from 'typeorm';
import Usuarios from '../../db/models/Usuarios';
import { exec } from 'child_process';
import saveLogs from '../logs';
import createToken from '../token';
import { isUndefined } from 'util';
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

			console.log('pass', encriptPass);

			const resUser = await getRepository(Usuarios).findOne({
				where: {
					login: user,
					contrasena: encriptPass,
				},
			});

			if (!resUser) throw { message: 'Correo o Contraseña incorrecta', code: 401 };

			const token: string = createToken(resUser.id, resUser.email);

			//save in log
			await saveLogs(resUser.email, 'POST', '/auth/login', `Login de Usuario`);

			const userRes = {
				login: resUser.login,
				name: resUser.nombre,
				id_department: {
					name: 'prueba',
					id: 1,
					active: 1,
				},
				id_rol: {
					name: 'prueba',
					id: 1,
					active: 1,
				},
			};

			const info = {
				user: userRes,
				views: {},
				permiss: [],
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

			res.status(200).json({ message: 'Usuario', user: resUser });
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	}
}
