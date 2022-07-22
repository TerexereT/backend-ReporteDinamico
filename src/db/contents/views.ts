import Views from '../models/Views';
import { getRepository } from 'typeorm';

export const listViews: Views[] = [
	{
		//1
		name: 'Inicio',
		root: 'home',
	},
	{
		//1
		name: 'Reporte 1',
		root: 'reporte',
	},
];

const views = async (): Promise<void> => {
	//
	const valid = await getRepository(Views).find({ where: listViews });
	if (!valid.length) await getRepository(Views).save(listViews);
};

export default views;
