import { DataSource } from 'typeorm';
import Department from '../models/Department';
import Usuarios from '../models/Usuario';

const preUsuario = (dep: Department): Usuarios => ({
	login: 'test',
	password: 'cUIdDUd5MxlsgKs0biXIJA==',
	name: 'reporte dinamico',
	id_type: 'V',
	ident: '12345678',
	email: 'test@correo.com',
	estatus: 1,
	department: dep,
});

const preUser = async (db: DataSource): Promise<void> => {
	console.log('llegueeee');
	const dep = await db.getRepository(Department).findOne({ where: { name: 'Seguridad' } });
	console.log(dep);

	if (!dep) {
		console.log('no existe el departmento');
		return null;
	}

	const user = preUsuario(dep);
	//
	const valid = await db.getRepository(Usuarios).find({ where: { login: user.login } });
	if (!valid.length) await db.getRepository(Usuarios).save(user);
};

export default preUser;
