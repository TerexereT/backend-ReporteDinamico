import { Application } from 'express';
import aboTerminal from './aboTerminal';
import auth from './auth';
import history from './history';
import seguridad from './seguridad';

export default (app: Application) => {
	auth(app);
	seguridad(app);
	history(app);
	aboTerminal(app);
};
