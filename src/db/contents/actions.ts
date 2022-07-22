import { getRepository } from 'typeorm';
import Actions from '../models/Actions';

export const listActions: Actions[] = [
	{
		name: 'base', //se va a utilizar para solo consultar
		id_views: 1,
		description: 'No hace nada',
	},
	//Acciones en vista 1
	{
		name: 'Ver reporte', //se va a utilizar para solo consultar
		id_views: 2,
		description: 'Ve los reportes de ...',
	},
];

const actions = async (): Promise<void> => {
	//
	const valid = await getRepository(Actions).find({ where: listActions });
	if (!valid.length) await getRepository(Actions).save(listActions);
};

export default actions;
