import { getRepository } from 'typeorm';
import Permissions from '../models/Permissions';
//
import { listActions } from './actions';
import { listRoles } from './roles';

const permissions = async (): Promise<void> => {
	let data: Permissions[] = [
		{
			id_department: 2,
			id_rol: 2, //work
			id_action: 2, //crear fm
		},
	];

	const valid = await getRepository(Permissions).find({ where: data });
	if (!valid.length) await getRepository(Permissions).save(data);
};

export default permissions;
