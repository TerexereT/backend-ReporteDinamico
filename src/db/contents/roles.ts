import { MilpagosDS } from '../config/DataSource';
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
	const valid = await MilpagosDS.getRepository(Roles).find({ where: listRoles });
	if (!valid.length) await MilpagosDS.getRepository(Roles).save(listRoles);
};

export default roles;
