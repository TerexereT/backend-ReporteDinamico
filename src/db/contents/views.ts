import { getRepository } from 'typeorm';
import Views from '../models/Views';

export const listViews: Views[] = [
	{
		name: 'Inicio',
		root: '',
		key: 1,
	},
	{
		name: 'Movimientos',
		root: 'movimientos',
		key: 2,
	},
	{
		name: 'Cuotas Vencidas',
		root: 'cuotas',
		key: 3,
	},
	{
		name: 'Cuotas Resumidas',
		root: 'cuotas-resumen',
		key: 4,
	},
	{
		name: 'Mantenimiento',
		root: 'mantenimiento',
		key: 5,
	},
	{
		name: 'Mantenimiento por ACI',
		root: 'mantenimiento-aci',
		key: 6,
	},
	{
		name: 'Libre Pago',
		root: 'libre-pago',
		key: 7,
	},
	{
		//8
		name: 'Pago Cuota',
		root: 'pago-cuota',
		key: 8,
	},
	{
		name: 'Transaccional',
		root: 'transaccional',
		key: 9,
	},
	{
		//11
		name: 'Archivo ContraCargo',
		root: 'contracargo-up',
		key: 10,
	},
	{
		//12
		name: 'Gestion de Seguridad',
		root: 'seguridad',
		key: 11,
	},
	{
		name: 'Contracargo Descontado',
		root: 'contracargo',
		key: 12,
	},
	{
		//14
		name: 'Ejecutar Contracargos',
		root: 'exec-contracargo',
		key: 13,
	},
];

const views = async (): Promise<void> => {
	//
	const valid = await getRepository(Views).find({ where: listViews });
	if (!valid.length) await getRepository(Views).save(listViews);
};

export default views;
