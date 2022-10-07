import { DataSource } from 'typeorm';
import Department from '../models/Department';
import Roles from '../models/Roles';
import Usuarios from '../models/Usuario';
import roles from './roles';

const preUsuario = (dep: Department, rol: Roles): Usuarios => ({
	login: 'test',
	password: 'cUIdDUd5MxlsgKs0biXIJA==',
	name: 'reporte dinamico',
	id_type: 'V',
	ident: '12345678',
	email: 'test@correo.com',
	estatus: 1,
	department: dep,
	rol: rol,
});

const preUser = async (db: DataSource): Promise<void> => {
	console.log('llegueeee');
	const dep = await db.getRepository(Department).findOne({ where: { name: 'Seguridad' } });
	console.log(dep);

	const rol = await db.getRepository(Roles).findOne({ where: { name: 'Trabajador' } });
	console.log(dep);

	if (!dep) {
		console.log('no existe el departmento');
		return null;
	}

	const user = preUsuario(dep, rol);
	//
	const valid = await db.getRepository(Usuarios).find({ where: { login: user.login } });
	if (!valid.length) await db.getRepository(Usuarios).save(user);
};

export default preUser;
