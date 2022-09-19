// import {UserController} from "./controller/UserController";

import Aboterminal from './controller/aboterminal';
import CancelarCuotas from './controller/CancelarCuotas';
import cuotas_resumidas from './controller/CuotasVencidas/cuotas_resumidas';
import cuotas_vencidas from './controller/CuotasVencidas/cuotas_vencidas';
import History from './controller/history';
import LibrePago from './controller/LibrePago';
import Contracargo from './controller/Lote1000pagos/Contracargo';
import plan_comi_inactivo from './controller/mantenimiento/plan_comision_inactivo';
import plan_man_inactivo from './controller/mantenimiento/plan_mantenimiento_inactivo';
import sin_comision from './controller/mantenimiento/sin_comision';
import sin_plan from './controller/mantenimiento/sin_plan';
import PagoCuota from './controller/PagoCuota';
import ReporteACI from './controller/ReporteACI';
import Seguridad from './controller/Seguridad';
import Transaccional from './controller/Transaccional';

export const Routes: any[] = [
	{
		method: 'post',
		route: '/mantenimiento/0',
		controller: sin_plan,
		action: 'all',
	},
	{
		method: 'get',
		route: '/mantenimiento/0/keys',
		controller: sin_plan,
		action: 'keys',
	},
	{
		method: 'post',
		route: '/mantenimiento/1',
		controller: sin_comision,
		action: 'all',
	},
	{
		method: 'get',
		route: '/mantenimiento/1/keys',
		controller: sin_comision,
		action: 'keys',
	},
	{
		method: 'post',
		route: '/mantenimiento/2',
		controller: plan_man_inactivo,
		action: 'all',
	},
	{
		method: 'get',
		route: '/mantenimiento/2/keys',
		controller: plan_man_inactivo,
		action: 'keys',
	},
	{
		method: 'post',
		route: '/mantenimiento/3',
		controller: plan_comi_inactivo,
		action: 'all',
	},
	{
		method: 'get',
		route: '/mantenimiento/3/keys',
		controller: plan_comi_inactivo,
		action: 'keys',
	},
	{
		method: 'post',
		route: '/cuotas_vencidas',
		controller: cuotas_vencidas,
		action: 'all',
	},
	{
		method: 'get',
		route: '/cuotas_vencidas/keys',
		controller: cuotas_vencidas,
		action: 'keys',
	},
	{
		method: 'post',
		route: '/cuotas_resumidas',
		controller: cuotas_resumidas,
		action: 'all',
	},
	{
		method: 'get',
		route: '/cuotas_resumidas/keys',
		controller: cuotas_resumidas,
		action: 'keys',
	},
	{
		method: 'post',
		route: '/cancelar_cuotas',
		controller: CancelarCuotas,
		action: 'all',
	},
	{
		method: 'get',
		route: '/cancelar_cuotas/keys',
		controller: CancelarCuotas,
		action: 'keys',
	},
	{
		method: 'put',
		route: '/cancelar_cuotas/cuota',
		controller: CancelarCuotas,
		action: 'update',
	},
	{
		method: 'get',
		route: '/dicom',
		controller: CancelarCuotas,
		action: 'dicom',
	},
	{
		method: 'get',
		route: '/reporte_aci/keys',
		controller: ReporteACI,
		action: 'keys',
	},
	{
		method: 'get',
		route: '/reporte_aci',
		controller: ReporteACI,
		action: 'all',
	},
	{
		method: 'post',
		route: '/libre-pago',
		controller: LibrePago,
		action: 'allHistory',
	},
	{
		method: 'get',
		route: '/libre-pago/keys',
		controller: LibrePago,
		action: 'keys',
	},
	{
		method: 'get',
		route: '/pago-cuotas/keys',
		controller: PagoCuota,
		action: 'keys',
	},
	{
		method: 'post',
		route: '/pago-cuota',
		controller: PagoCuota,
		action: 'allHistory',
	},
	{
		method: 'post',
		route: '/1000pagos/up/leto',
		controller: Contracargo,
		action: 'upFile',
	},
	{
		method: 'get',
		route: '/contracargo/keys',
		controller: Contracargo,
		action: 'keys',
	},
	{
		method: 'get',
		route: '/contracargo',
		controller: Contracargo,
		action: 'all',
	},
	{
		method: 'post',
		route: '/contracargo/exec',
		controller: Contracargo,
		action: 'execContracargo',
	},
	{
		method: 'get',
		route: '/transaccional/keys',
		controller: Transaccional,
		action: 'keys',
	},
	{
		method: 'get',
		route: '/transaccional/options',
		controller: Transaccional,
		action: 'options',
	},
	{
		method: 'get',
		route: '/transaccional/transType',
		controller: Transaccional,
		action: 'transType',
	},
	{
		method: 'post',
		route: '/transaccional',
		controller: Transaccional,
		action: 'all',
	},
	{
		method: 'get',
		route: '/seguridad/worker/all',
		controller: Seguridad,
		action: 'allWorker',
	},
	{
		method: 'get',
		route: '/seguridad/departments/all',
		controller: Seguridad,
		action: 'allDepartment',
	},
	{
		method: 'get',
		route: '/seguridad/roles/all',
		controller: Seguridad,
		action: 'allRoles',
	},
	/*
	{
		method: 'get',
		route: 'seguridad/worker/:id',
		controller: Seguridad,
		action: 'dataUser',
	},
	*/
];
