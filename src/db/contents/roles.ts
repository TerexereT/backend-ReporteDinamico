import { getRepository } from 'typeorm';
import Roles from '../models/Roles';

export const listRoles: Roles[] = [
	{
		name: 'Base',
	},
	{
		name: 'Trabajador',
	},
	{
		name: 'Supervisor',
	},
	{
		name: 'Admin',
	},
];

const roles = async (): Promise<void> => {
	//
	const valid = await getRepository(Roles).find({ where: listRoles });
	if (!valid.length) await getRepository(Roles).save(listRoles);
};

export default roles;
