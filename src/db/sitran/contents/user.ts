import { DataSource } from 'typeorm';
import Department from '../models/Department';
import Roles from '../models/Roles';
import Status from '../models/Status';
import Usuarios from '../models/Usuario';

const preUsuario = (department: Department, rol: Roles, status: Status): Usuarios => ({
	login: 'test',
	password: 'cUIdDUd5MxlsgKs0biXIJA==',
	name: 'reporte dinamico',
	id_type: 'V',
	ident: '12345678',
	email: 'test@correo.com',
	estatus: 1,
	department,
	rol,
	status,
});

const preUser = async (db: DataSource): Promise<void> => {
	const dep = await db.getRepository(Department).findOne({ where: { name: 'Seguridad' } });
	//console.log(dep);

	const rol = await db.getRepository(Roles).findOne({ where: { name: 'Trabajador' } });
	//console.log(dep);

	const status = await db.getRepository(Status).findOne({ where: { name: 'Nuevo' } });
	//console.log(status);

	if (!dep) {
		console.log('no existe el departmento');
		return null;
	}

	const user = preUsuario(dep, rol, status);
	//
	const valid = await db.getRepository(Usuarios).find({ where: { login: user.login } });
	if (!valid.length) await db.getRepository(Usuarios).save(user);
};

export default preUser;
