// import {UserController} from "./controller/UserController";

import { Router } from 'express';
import History from './controller/history';
import Aboterminal from './controller/aboterminal';

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
];
