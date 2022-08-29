import { getRepository } from 'typeorm';
import UsuariosXPerfil from '../models/Usuario_Work';

export const prePerfilesUsuario: UsuariosXPerfil[] = [
	{
		id_usuario: 162, //kpolo
		id_rol: 2, //work
		id_department: 2, //;
	},
];

const preDataUser = async (): Promise<void> => {
	//
	const valid = await getRepository(UsuariosXPerfil).find({ where: prePerfilesUsuario });
	if (!valid.length) await getRepository(UsuariosXPerfil).save(prePerfilesUsuario);
};

export default preDataUser;
