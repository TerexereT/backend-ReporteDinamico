import { getRepository } from 'typeorm';
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
	const valid = await getRepository(Department).find({ where: listDeparment });
	if (!valid.length) await getRepository(Department).save(listDeparment);
};

export default department;
