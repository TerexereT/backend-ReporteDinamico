// import {UserController} from "./controller/UserController";

import { Router } from 'express';
import History from './controller/history';
import Aboterminal from './controller/aboterminal';
import sin_plan from './controller/mantenimiento/sin_plan';
import sin_comision from './controller/mantenimiento/sin_comision';
import plan_tarifa from './controller/mantenimiento/plan_tarifa';

// export const Routes = [{
//     method: "get",
//     route: "/users",
//     controller: UserController,
//     action: "all"
// }, {
//     method: "get",
//     route: "/users/:id",
//     controller: UserController,
//     action: "one"
// }, {
//     method: "post",
//     route: "/users",
//     controller: UserController,
//     action: "save"
// }, {
//     method: "delete",
//     route: "/users/:id",
//     controller: UserController,
//     action: "remove"
// }];
export const Routes: any[] = [
	{
		method: 'post',
		route: '/history',
		controller: History,
		action: 'allHistory',
	},
	{
		method: 'get',
		route: '/history/keys',
		controller: History,
		action: 'keys',
	},
	{
		method: 'post',
		route: '/aboterminal',
		controller: Aboterminal,
		action: 'all',
	},
	{
		method: 'get',
		route: '/aboterminal/keys',
		controller: Aboterminal,
		action: 'keys',
	},
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
	},	{
		method: 'post',
		route: '/mantenimiento/2',
		controller: plan_tarifa,
		action: 'all',
	},
	{
		method: 'get',
		route: '/mantenimiento/2/keys',
		controller: plan_tarifa,
		action: 'keys',
	},
];
