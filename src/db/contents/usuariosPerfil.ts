import { MilpagosDS } from '../config/DataSource';
import Usuarios from '../models/Usuarios';
import UsuariosXPerfil from '../models/Usuario_Work';

const preDataUser = async (): Promise<void> => {
	const user = await MilpagosDS.getRepository(Usuarios).findOne({ where: { login: 'test' } });

	if (!user) {
		console.log('no existe el usuario');
		return null;
	}

	const prePerfilesUsuario: UsuariosXPerfil = {
		id_usuario: user.id, //kpolo
		id_rol: 2, //work
		id_department: 3, //;
	};
	//
	const valid = await MilpagosDS.getRepository(UsuariosXPerfil).find({ where: prePerfilesUsuario });
	if (!valid.length) await MilpagosDS.getRepository(UsuariosXPerfil).save(prePerfilesUsuario);
};

export default preDataUser;
