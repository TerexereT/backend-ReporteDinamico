import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import Actions from '../../db/models/Actions';
import Department from '../../db/models/Department';
import Permissions from '../../db/models/Permissions';
import Roles from '../../db/models/Roles';
import Usuarios from '../../db/models/Usuarios';
import UsuarioXWork from '../../db/models/Usuario_Work';
import Views from '../../db/models/Views';
import ViewsXDepartment from '../../db/models/ViewsXDepartment';
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
		const { id: idUser } = req.params;
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
			console.log(idUser, id_rol, id_department, block);
			await getRepository(UsuarioXWork).save({
				id_usuario: idUser,
				id_rol,
				id_department: id_department,
				active: block ? 0 : 1,
			});
		}

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

		const newDep = await getRepository(Department).save({
			name: nameDep,
		});

		const vistToHome = await getRepository(ViewsXDepartment).save({
			id_department: newDep.id,
			id_views: 1,
		});

		//
		res.status(200).json({ message: 'Departamento creado', info: newDep });
	} catch (err) {
		res.status(400).json(err);
	}
};

export const getPermissions = async (req: Request<any, msg, body, Querys>, res: Response<msg>): Promise<void> => {
	try {
		const { id_dep, id_rol }: any = req.params;

		let info = [];

		const viewsXdep = await getRepository(Department).findOne({
			where: { active: 1, id: id_dep },
			relations: ['access_views', 'access_views.id_views', 'access_views.id_views.actions'],
		});

		const { access_views }: any = viewsXdep;

		if (!access_views.length) {
			throw { message: 'No tiene niguna vista asignada' };
		}

		let actions: any = [];

		await access_views.forEach((item: any) => {
			//console.log(...item.id_views.actions);
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

		//console.log('actions', actions);

		const permiss = await getRepository(Permissions).find({
			where: { id_rol, id_department: id_dep },
			relations: ['id_rol', 'id_department', 'id_action'],
		});

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

		const perm = await getRepository(Permissions).find({
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
						await getRepository(Permissions).update(perm[i].id, {
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

			//if (listUpdate.length) await getRepository(fm_permissions).update(listUpdate, listUpdate);
			if (listSave.length) await getRepository(Permissions).save(listSave);
		};

		await saveListPermiss(perm, newAction);

		//console.log(perm);

		//logs
		//const { id: id_user }: any = req.headers.token;
		//await saveLogs(id_user, 'POST', req.url, `Cambio los permisos del departamento:${id_dep}/rol:${id_rol}`);

		res.status(200).json({ message: 'updated permisses' });
	} catch (err) {
		res.status(400).json(err);
	}
};

export const getViews = async (req: Request<any, msg, body, Querys>, res: Response<msg>): Promise<void> => {
	try {
		const { id_dep }: any = req.params;

		const views = await getRepository(Views).find({ active: 1 });

		const access = await getRepository(ViewsXDepartment).find({
			where: { id_department: id_dep },
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

		res.status(200).json({ message: 'views', info });
	} catch (err) {
		res.status(400).json(err);
	}
};

export const updateViews = async (req: Request<any, msg, body, Querys>, res: Response<msg>): Promise<void> => {
	try {
		const { id_dep }: any = req.params;
		const newViews: any = req.body;

		const accessList = await getRepository(ViewsXDepartment).find({
			where: { id_department: id_dep },
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
							id_deparment: id_dep,
							id_views: views[j].id,
							active: views[j].status ? 1 : 0,
						});
						await getRepository(ViewsXDepartment).update(access[i].id, {
							active: views[j].status ? 1 : 0,
						});
					}
				}
				if (!flag) {
					if (views[j].status)
						listSave.push({
							id_department: id_dep,
							id_views: views[j].id,
							active: views[j].status ? 1 : 0,
						});
				}
			}

			//console.log('existente', listUpdate);
			//console.log('crear', listSave);

			//if (listUpdate.length) await getRepository(fm_permissions).update(listUpdate, listUpdate);
			if (listSave.length) await getRepository(ViewsXDepartment).save(listSave);
		};

		await saveListViews(accessList, newViews);

		//logs
		//const { id }: any = req.headers.token;
		//await saveLogs(id, 'POST', req.url, `Cambio de vistas al dep: ${id_dep} `);

		res.status(200).json({ message: 'updated view' });
	} catch (err) {
		res.status(400).json(err);
	}
};
