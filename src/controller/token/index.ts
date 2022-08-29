import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import Department from '../../db/models/Department';
import Roles from '../../db/models/Roles';
//const { HOST, PORT_PROVIDERS } = dotenv;

const dot = config();

const createToken = (id: number, email: string, id_department: number, id_rol: number): string => {
	const token: string = sign({ id, email, idDep: id_department, idRol: id_rol }, process.env.SECRET!, {
		expiresIn: '4h',
	});
	console.log('token creado', token);
	return token;
};

export default createToken;
