import { exec } from 'child_process';
import { Request, Response } from 'express';
import * as path from 'path';
import { DataSource } from 'typeorm';
import ViewsXDep from '../../db/global/models/ViewsXDepartment';
import Department from '../../db/sitran/models/Department';
import UsuariosSitran from '../../db/sitran/models/Usuario';
import saveLogs from '../logs';
import createToken from '../token';
import { getDatasource, SitranDS } from './../../db/config/DataSource';
import { getViews } from './formatData';
import bcrypt from 'bcrypt';
import Status from '../../db/sitran/models/Status';
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

export const login = async (req: Request<body, any>, res: Response<msg>) => {
	try {
		const { user, password } = req.body;
		if (!user || !password) throw { message: 'Debe ingresar usuario y contrasena' };

		// const encriptPass = await execCommand(`java -jar java.encript/java.jar ${password}`, password);

		//console.log('pass', encriptPass);

		const salt: string = await bcrypt.genSalt(10);
		const passEncript = await bcrypt.hash(password, salt);

		const resUserDS = await SitranDS.getRepository(UsuariosSitran).findOne({
			where: [
				{
					login: user,
				},
			],
			relations: ['department', 'status'],
		});

		//console.log('aqui', resUserDS.status);

		if (!resUserDS) throw { message: 'Correo o Contraseña incorrecta', code: 401 };

		switch (resUserDS.status.id) {
			case 1: //Nuevo
				const activo = await SitranDS.getRepository(Status).findOne({
					where: { id: 2 },
				});
				await SitranDS.getRepository(UsuariosSitran).update(resUserDS.id, {
					password: passEncript,
					status: activo,
				});
				break;
			case 2: //Activo
				const validPassword = await bcrypt.compare(password, resUserDS.password);
				//console.log(validPassword);
				if (!validPassword) {
					throw { message: 'Contrasena incorrecta', code: 400 };
				}
				break;
			case 3: //Bloqueado
				throw { message: 'Usuario Bloquado', code: 401 };
			case 4: //Inactivo
				throw { message: 'Usuario Inactivo', code: 401 };
		}

		const DS: DataSource = getDatasource(req.headers.key_agregador);

		const viewXDep = await DS.getRepository(ViewsXDep).find({
			where: { id_department: resUserDS.department.id },
			relations: ['id_views'],
		});

		const department = resUserDS.department;
		const rol = {
			id: 1,
		};

		if (!department.active) throw { message: `El departamento de ${department.name} esta Bloqueado`, code: 401 };
		const views = getViews(viewXDep); //obtener lista de vistas
		//
		let permiss: any = [];

		//buscar permisos
		// if (department.id !== 1) {
		// 	const resPermiss = await DS.getRepository(Permissions).find({
		// 		where: { id_department: department.id, id_rol: id_rol.id },
		// 		relations: ['id_action'],
		// 	});
		// 	if (!resPermiss) throw { message: 'Error Access Permisses', code: 400 };

		// 	permiss = getPermiss(resPermiss);

		// 	//console.log(permiss);
		// } else {
		// 	//console.log('usuario no posee nigun deparmento');
		// }

		//console.log('rol:', id_rol, 'dep:', id_department);

		const token: string = createToken(resUserDS.id, resUserDS.email, department.id, rol.id);

		//save in log
		await saveLogs(resUserDS.email, 'POST', '/auth/login', `Login de Usuario`);

		const userRes = {
			login: resUserDS.login,
			name: resUserDS.name,
			id_department: department,
			id_rol: rol,
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
};

export const getLogin = async (req: Request<any, msg, body>, res: Response<msg>) => {
	try {
		const { id, email }: any = req.headers.token;

		const resUser = await SitranDS.getRepository(UsuariosSitran).findOne({
			where: { id },
			relations: ['department'],
		});

		if (!resUser) throw { message: 'Usuario no existe en Sitran' };

		const DS: DataSource = getDatasource(req.headers.key_agregador);
		//console.log('DS', req.headers.key_agregador);

		const viewXDep = await DS.getRepository(ViewsXDep).find({
			where: { id_department: resUser.department.id },
			relations: ['id_views'],
		});

		const { department }: any = resUser;
		const rol = {
			id: 1,
		};

		if (!department.active) throw { message: `El departamento de ${department.name} esta Bloqueado`, code: 401 };
		const views = getViews(viewXDep); //obtener lista de vistas
		//
		let permiss: any = [];

		//buscar permisos
		// if (id_department.id !== 1) {
		// 	const resPermiss = await MilpagosDS.getRepository(Permissions).find({
		// 		where: { id_department: id_department.id, id_rol: id_rol.id },
		// 		relations: ['id_action'],
		// 	});
		// 	if (!resPermiss) throw { message: 'Error Access Permisses', code: 400 };

		// 	permiss = getPermiss(resPermiss);
		// }

		const userRes = {
			login: resUser.login,
			name: resUser.name,
			id_department: department,
			id_rol: rol,
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
};
