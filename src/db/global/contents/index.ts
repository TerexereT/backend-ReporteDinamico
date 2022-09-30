import { DataSource } from 'typeorm';
import librePago from '../../../router/librePago';
import { CarropagoDS, LibrepagoDS, MilpagosDS } from '../../config/DataSource';
import access_views from './access.views';
import actions from './actions';
import views from './views';

MilpagosDS.initialize()
	.then(async () => {
		console.log('Running PreData');
		console.log(1);
		await views(MilpagosDS);
		console.log(3);
		await actions(MilpagosDS);
		console.log(4);
		await access_views(MilpagosDS);
		console.log(5);
		console.log('Listo');
	})
	.catch((err) => {
		console.log(err);
		process.exit();
	});

CarropagoDS.initialize()
	.then(async () => {
		console.log('Running PreData');
		console.log(1);
		await views(MilpagosDS);
		console.log(3);
		await actions(MilpagosDS);
		console.log(4);
		await access_views(MilpagosDS);
		console.log(5);
		console.log('Listo');
	})
	.catch((err) => {
		console.log(err);
		process.exit();
	});

LibrepagoDS.initialize()
	.then(async () => {
		console.log('Running PreData');
		console.log(1);
		await views(MilpagosDS);
		console.log(3);
		await actions(MilpagosDS);
		console.log(4);
		await access_views(MilpagosDS);
		console.log(5);
		console.log('Listo');
	})
	.catch((err) => {
		console.log(err);
		process.exit();
	});
