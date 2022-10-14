import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { CarropagoDS, getDatasource, LibrepagoDS, MilpagosDS, SitranDS } from '../../db/config/DataSource';
import Actions from '../../db/global/models/Actions';
import Permissions from '../../db/global/models/Permissions';
import Views from '../../db/global/models/Views';
import { default as ViewsXDepartment } from '../../db/global/models/ViewsXDepartment';
import Department from '../../db/sitran/models/Department';
import Roles from '../../db/sitran/models/Roles';
import Status from '../../db/sitran/models/Status';
import UsuariosSitran from '../../db/sitran/models/Usuario';
import saveLogs from '../logs';
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

export default {
	async allWorker(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			//buscar los usuarios agregados a reporte dinamico

			const sitraners = await SitranDS.getRepository(UsuariosSitran).find();

			if (!sitraners) throw { message: 'No existen Usuario' };

			const info: any[] = sitraners.map((worker: any) => {
				const { contrasena, ...data } = worker;

				return data;
			});

			//console.log(info);

			res.status(200).json({ message: 'data del usuario', info });
		} catch (err) {
			//console.log(err);
			res.status(400).json(err);
		}
	},

	async allDepartment(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const info = await SitranDS.getRepository(Department).find();

			res.status(200).json({ message: 'departments', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},

	async allRoles(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const info = await SitranDS.getRepository(Roles).find();

			res.status(200).json({ message: 'roles', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},

	async dataUser(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			//console.log('entreeee');
			//console.log(req.params);
			//const info = await SitranDS.getRepository(Roles).find();

			res.status(200).json({ message: 'user', info: {} });
		} catch (err) {
			res.status(400).json(err);
		}
	},
};

export const dataUserData = async (req: Request<any, msg, body, Querys>, res: Response<msg>): Promise<void> => {
	try {
		//console.log('dataUserData', req.params);
		const id = req.params.id;
		if (!id) throw { message: 'No existe el usuario' };
		console.log(id);

		const user = await SitranDS.getRepository(UsuariosSitran).findOne({
			where: {
				id,
			},
			relations: ['rol', 'department'],
		});

		if (!user) throw { message: 'No existe el usuario' };

		let info = {};

		info = {
			active: user.estatus,
			id_rol: user.rol,
			id_department: user.department,
		};

		console.log(info);

		res.status(200).json({ message: 'user', info });
	} catch (err) {
		res.status(400).json(err);
	}
};

export const updateUserData = async (req: Request<any, msg, body, Querys>, res: Response<msg>): Promise<void> => {
	try {
		const idUser: number = req.params.id;

		const { id_rol, id_department, block }: any = req.body;

		const resUser = await SitranDS.getRepository(UsuariosSitran).findOne({ where: { id: idUser } });

		if (!resUser) throw { message: 'Usuario no existe' };

		if (!id_rol || !id_department) throw { message: 'Faltan departamento o rol' };

		const rol = await SitranDS.getRepository(Roles).findOne({ where: { id: id_rol } });
		const department = await SitranDS.getRepository(Department).findOne({ where: { id: id_department } });

		if (!rol) throw { message: 'Rol no existe' };
		if (!department) throw { message: 'Departamento no existe' };

		const user = await SitranDS.getRepository(UsuariosSitran).update(resUser.id, {
			rol,
			department,
		});

		const { email }: any = req.headers.token;
		await saveLogs(email, 'POST', req.url, `Modifico el usuario: [${idUser}], Perfil [${resUser.id}]`);

		//
		res.status(200).json({ message: 'update user' });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const createDepartment = async (
	req: Request<any, msg, body, Querys>,
	res: Response<msg>
): Promise<void> => {
	try {
		const { nameDep }: any = req.body;

		if (!nameDep || nameDep.length < 3) throw { message: 'Nombre del Departmento invalido' };

		const existDep = await SitranDS.getRepository(Department).findOne({
			where: { name: nameDep },
		});

		if (existDep) throw { message: `Ya existe el departamento ${nameDep}` };

		const newDep = await SitranDS.getRepository(Department).save({
			name: nameDep,
		});

		//[3312]
		await MilpagosDS.getRepository(ViewsXDepartment).save({
			id_department: 1,
			id_views: 1,
		});

		await CarropagoDS.getRepository(ViewsXDepartment).save({
			id_department: 1,
			id_views: 1,
		});

		await LibrepagoDS.getRepository(ViewsXDepartment).save({
			id_department: 1,
			id_views: 1,
		});

		const { email }: any = req.headers.token;
		await saveLogs(email, 'POST', req.url, `Creo el departamento: ${nameDep}`);

		//
		res.status(200).json({ message: 'Departamento creado', info: newDep });
	} catch (err) {
		res.status(400).json(err);
	}
};

export const getPermissions = async (req: Request<any, msg, body, Querys>, res: Response<msg>): Promise<void> => {
	try {
		const { id_dep, id_rol }: { id_dep: number; id_rol: number } = req.params;

		const viewsXdep = await MilpagosDS.getRepository(Department).findOne({
			where: { active: 1, id: id_dep },
			relations: ['access_views', 'access_views.id_views', 'access_views.id_views.actions'],
		});

		//[3312]
		const access_views: ViewsXDepartment[] = [];

		if (!access_views.length) {
			throw { message: 'No tiene niguna vista asignada' };
		}

		let actions: any = [];

		access_views.forEach((item: any) => {
			const { actions: acc, ...vis }: any = item.id_views;
			if (item.active) {
				item.id_views.actions.forEach((el: Actions) => {
					console.log('save', el);
					actions.push({
						...el,
						id_views: vis,
					});
				});
			}
		});

		const rol = await MilpagosDS.getRepository(Roles).findOne({
			where: { id: id_rol },
		});

		const permiss = [];
		const getListFormat = (perm: any[], action: any[]) => {
			let list: any = [];
			for (let j = 0; j < action.length; j++) {
				let flag = false;
				for (let i = 0; i < perm.length; i++) {
					if (action[j].id === perm[i].id_action.id) {
						flag = true;
						list.push({
							id: action[j].id,
							view: action[j].id_views,
							name: action[j].name,
							description: action[j].description,
							status: perm[i].active ? true : false,
						});
					}
				}
				if (!flag) {
					list.push({
						id: action[j].id,
						name: action[j].name,
						description: action[j].description,
						view: action[j].id_views,
						status: false,
					});
				}
			}
			return list;
		};

		let info = [];

		info = getListFormat(permiss, actions);

		res.status(200).json({ message: 'permisos', info });
	} catch (err) {
		res.status(400).json(err);
	}
};

export const updatePermissions = async (req: Request<any>, res: Response<msg>): Promise<void> => {
	try {
		const { id_dep, id_rol }: any = req.params;
		const newAction: any = req.body;

		const perm = await MilpagosDS.getRepository(Permissions).find({
			where: { id_rol, id_department: id_dep },
			relations: ['id_action'],
		});

		//console.log(newAction);

		const saveListPermiss = async (perm: any[], action: any[]) => {
			let listSave: any[] = [];
			let listUpdate: any[] = [];
			for (let j = 0; j < action.length; j++) {
				let flag = false;
				for (let i = 0; i < perm.length; i++) {
					if (action[j].id === perm[i].id_action.id) {
						flag = true;
						listUpdate.push({
							id: perm[i].id,
							id_deparment: id_dep,
							id_rol,
							id_action: action[j].id,
							active: action[j].status ? 1 : 0,
						});
						await MilpagosDS.getRepository(Permissions).update(perm[i].id, {
							active: action[j].status ? 1 : 0,
						});
					}
				}
				if (!flag) {
					if (action[j].status)
						listSave.push({
							id_department: id_dep,
							id_rol: id_rol,
							id_action: action[j].id,
							active: action[j].status ? 1 : 0,
						});
				}
			}

			///console.log('existente', listUpdate);
			//console.log('crear', listSave);

			//if (listUpdate.length) await MilpagosDS.getRepository(fm_permissions).update(listUpdate, listUpdate);
			if (listSave.length) await MilpagosDS.getRepository(Permissions).save(listSave);
		};

		await saveListPermiss(perm, newAction);

		//console.log(perm);

		const { email }: any = req.headers.token;
		await saveLogs(email, 'POST', req.url, `Edito los permisos dep: ${id_dep}, Rol:${id_rol}`);

		res.status(200).json({ message: 'updated permisses' });
	} catch (err) {
		res.status(400).json(err);
	}
};

export const getViews = async (req: Request<any, msg, body, Querys>, res: Response<msg>): Promise<void> => {
	try {
		const id_dep: number = req.params.id_dep;

		const DS: DataSource = getDatasource(req.headers.key_agregador);

		const views = await DS.getRepository(Views).find({ where: { active: 1 } });

		if (!views.length) throw { message: 'No existen vistas disponibles' };

		const dep = await SitranDS.getRepository(Department).findOne({ where: { id: id_dep } });

		if (!dep) throw { message: `No existe el departamento con el id:${id_dep}` };

		const access = await DS.getRepository(ViewsXDepartment).find({
			where: { id_department: dep.id },
			relations: ['id_views'],
		});

		const getListFormat = (item_access: any[], item_views: any[]) => {
			let list: any = [];
			for (let j = 0; j < item_views.length; j++) {
				let flag = false;
				for (let i = 0; i < item_access.length; i++) {
					if (item_views[j].id === item_access[i].id_views.id) {
						flag = true;
						list.push({
							id: item_views[j].id,
							name: item_views[j].name,
							status: item_access[i].active ? true : false,
						});
					}
				}
				if (!flag) {
					list.push({
						id: item_views[j].id,
						name: item_views[j].name,
						status: false,
					});
				}
			}
			return list;
		};

		const info = getListFormat(access, views);
		// console.log(info);

		res.status(200).json({ message: 'views', info });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const updateViews = async (req: Request<any, msg, body, Querys>, res: Response<msg>): Promise<void> => {
	try {
		const { id_dep }: any = req.params;
		const newViews: any = req.body;

		const DS: DataSource = getDatasource(req.headers.key_agregador);

		const dep = await SitranDS.getRepository(Department).findOne({ where: { id: id_dep } });

		if (!dep) throw { message: `No existe el departamento con el id:${id_dep}` };

		const accessList = await DS.getRepository(ViewsXDepartment).find({
			where: { id_department: dep.id },
			relations: ['id_views'],
		});

		//console.log(newViews);

		const saveListViews = async (access: any[], views: any[]) => {
			let listSave: any[] = [];
			let listUpdate: any[] = [];
			for (let j = 0; j < views.length; j++) {
				let flag = false;
				for (let i = 0; i < access.length; i++) {
					if (views[j].id === access[i].id_views.id) {
						flag = true;
						listUpdate.push({
							id: access[i].id,
							id_deparment: dep.id,
							id_views: views[j].id,
							active: views[j].status ? 1 : 0,
						});
						await DS.getRepository(ViewsXDepartment).update(access[i].id, {
							active: views[j].status ? 1 : 0,
						});
					}
				}
				if (!flag) {
					if (views[j].status)
						listSave.push({
							id_department: dep.id,
							id_views: views[j].id,
							active: views[j].status ? 1 : 0,
						});
				}
			}

			const { email }: any = req.headers.token;
			await saveLogs(email, 'POST', req.url, `Edito las vistas dep: ${id_dep}`);

			//if (listUpdate.length) await MilpagosDS.getRepository(fm_permissions).update(listUpdate, listUpdate);
			if (listSave.length) await MilpagosDS.getRepository(ViewsXDepartment).save(listSave);
		};

		await saveListViews(accessList, newViews);

		//logs
		const { email }: any = req.headers.token;
		await saveLogs(email, 'POST', req.url, `Cambio de vistas al dep: ${id_dep} `);

		res.status(200).json({ message: 'updated view' });
	} catch (err) {
		res.status(400).json(err);
	}
};

export const updateDepartments = async (
	req: Request<any, msg, body, Querys>,
	res: Response<msg>
): Promise<void> => {
	try {
		const { listDeps }: any = req.body;

		listDeps.forEach(async (dep: any) => {
			await MilpagosDS.getRepository(Department).update(dep.id, {
				active: dep.active,
			});
		});

		//Logs
		const { email }: any = req.headers.token;
		await saveLogs(email, 'POST', req.url, `Cambio de departamentos disponibles`);

		res.status(200).json({ message: 'updated department' });
	} catch (err) {
		res.status(400).json(err);
	}
};

interface InterfaceBody {
	login: string;
	name: string;
	email: string;
	type_doc: string;
	doc: string;
	rol: Roles;
	dep: Department;
}

export const createUser = async (req: Request<any>, res: Response<msg>): Promise<void> => {
	try {
		const { login, name, email, type_doc, doc, rol, dep }: InterfaceBody = req.body;
		console.log(req.body);

		const validIdent = await SitranDS.getRepository(UsuariosSitran).findOne({
			where: {
				id_type: type_doc,
				ident: doc,
			},
		});
		if (validIdent) throw { message: 'El documento de identidad ya existe' };

		const validLogin = await SitranDS.getRepository(UsuariosSitran).find({
			where: { login },
		});
		if (validLogin) throw { message: 'El login ya existe' };

		const validMail = await SitranDS.getRepository(UsuariosSitran).find({
			where: { email },
		});
		if (validMail) throw { message: 'El correo ya existe' };

		const nuevo: Status = await SitranDS.getRepository(Status).findOne({
			where: { id: 1 },
		});

		await SitranDS.getRepository(UsuariosSitran).save({
			login,
			password: '',
			name,
			id_type: type_doc,
			ident: doc,
			email,
			department: dep,
			rol: rol,
			status: nuevo,
			estatus: 1,
		});

		res.status(200).json({ message: 'Usuario creado' });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};
