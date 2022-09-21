import { Application } from 'express';
import aboTerminal from './aboTerminal';
import auth from './auth';
import contracargo from './contracargo';
import cuotasResumidas from './cuotasResumidas';
import history from './history';
import librePago from './librePago';
import mantenimiento from './mantenimiento';
import pagoCuota from './pagoCuota';
import reporteAci from './reporteAci';
import seguridad from './seguridad';
import transaccional from './transaccional';

const Routes = (app: Application) => {
	auth(app);
	seguridad(app);
	history(app);
	aboTerminal(app);
	transaccional(app);
	cuotasResumidas(app);
	librePago(app);
	reporteAci(app);
	pagoCuota(app);
	mantenimiento(app);
	contracargo(app);
};

export default Routes;
