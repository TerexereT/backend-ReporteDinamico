import { MilpagosDS } from '../config/DataSource';
import Department from '../models/Department';

export const listDeparment: Department[] = [
	{
		//1
		name: 'Ninguno',
	},
	{
		//2
		name: 'Operaciones',
	},
	{
		//3
		name: 'Seguridad',
	},
];

const department = async (): Promise<void> => {
	//
	const valid = await MilpagosDS.getRepository(Department).find({ where: listDeparment });
	if (!valid.length) await MilpagosDS.getRepository(Department).save(listDeparment);
};

export default department;
