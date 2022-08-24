import Views from '../models/Views';
import { getRepository } from 'typeorm';

export const listViews: Views[] = [
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
		//8
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
		//11
		name: 'Archivo ContraCargo',
		root: 'contraCargoUp',
	},
	{
		//12
		name: 'Gestion de Seguridad',
		root: 'Gestion de Seguridad',
	},
	{
		name: 'Contracargos',
		root: 'contracargo',
	},
	{
		//14
		name: 'Ejecutar Contracargos',
		root: 'exec-contracargo',
	},
];

const views = async (): Promise<void> => {
	//
	const valid = await getRepository(Views).find({ where: listViews });
	if (!valid.length) await getRepository(Views).save(listViews);
};

export default views;
