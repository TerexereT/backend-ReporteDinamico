import { Application } from 'express';
import seguridad from './seguridad';

export default (app: Application) => {
	seguridad(app);
};
