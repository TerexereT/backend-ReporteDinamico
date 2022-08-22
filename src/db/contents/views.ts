import Views from '../models/Views';
import { getRepository } from 'typeorm';

export const listViews: Views[] = [
	{
		//1
		name: 'Inicio',
		root: 'home',
	},
	{
		name: 'Inicio',
		root: 'baseUrl',
	},
	{
		name: 'Cancelar Cuotas',
		root: 'cancelarCuotas',
	},
	{
		name: 'Cuotas Vencidas',
		root: 'cuotas',
	},
	{
		name: 'Cuotas Resumidas',
		root: 'cuotasR',
	},
	{
		name: 'Libre Pago',
		root: 'librePago',
	},
	{
		name: 'Mantenimiento',
		root: 'mantenimientos',
	},
	{
		name: 'Movimientos',
		root: 'movimientos',
	},
	{
		name: 'Pago Cuota',
		root: 'pagoCuota',
	},
	{
		name: 'Mantenimiento por ACI',
		root: 'reportexaci',
	},
	{
		name: 'Transaccional',
		root: 'transaccional',
	},
	{
		name: 'Archivo ContraCargo',
		root: 'contraCargo',
	},
	{
		name: 'Gestion de Seguridad',
		root: 'Gestion de Seguridad',
	},
];

const views = async (): Promise<void> => {
	//
	const valid = await getRepository(Views).find({ where: listViews });
	if (!valid.length) await getRepository(Views).save(listViews);
};

export default views;
