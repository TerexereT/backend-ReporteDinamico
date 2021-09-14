import Err from './err';
import err_404 from './err/err_404';
import cors from './secure';

import { Application } from 'express';

/** Middleware PreRoutes */
export const preRoutes: any = (app: Application): void => {
	app.use(cors);
};

/** Middleware PostRoutes */
export const posRoutes: any = (app: Application): void => {
	app.use(Err);
	app.use(err_404);
};
