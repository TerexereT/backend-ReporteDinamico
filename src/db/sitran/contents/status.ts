import { DataSource } from 'typeorm';
import Roles from '../models/Roles';
import Status from '../models/Status';

const list: Status[] = [
	{
		name: 'Nuevo',
	},
	{
		name: 'Activo',
	},
	{
		name: 'Bloquado',
	},
	{
		name: 'Inactivo',
	},
];

const status = async (db: DataSource): Promise<void> => {
	//
	const valid = await db.getRepository(Status).find({ where: list });
	if (!valid.length) await db.getRepository(Status).save(list);
};

export default status;
