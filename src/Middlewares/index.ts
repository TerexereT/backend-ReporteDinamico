import { Application } from 'express';
import Err from './err';
import err_404 from './err/err_404';
import cors from './secure';
import token from './token';

/** Middleware PreRoutes */
export const preRoutes: any = (app: Application): void => {
	app.use(cors);
	app.use(token);
};

/** Middleware PostRoutes */
export const posRoutes: any = (app: Application): void => {
	app.use(Err);
	app.use(err_404);
};
