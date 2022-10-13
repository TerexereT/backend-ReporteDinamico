import { CarropagoDS, LibrepagoDS, MilpagosDS } from '../../config/DataSource';
import access_views from './access.views';
import actions from './actions';
import views from './views';

const init = async () => {
	await MilpagosDS.initialize()
		.then(async () => {
			console.log('Running PreData Mil');
			console.log('1 Mil');
			await views(MilpagosDS);
			console.log('2 Mil');
			await actions(MilpagosDS);
			console.log('3 Mil');
			await access_views(MilpagosDS);
			console.log('4 Mil');
			console.log('Listo');
		})
		.catch((err) => {
			console.log(err);
			process.exit();
		});

	await CarropagoDS.initialize()
		.then(async () => {
			console.log('Running PreData Carropago');
			console.log('1 carro');
			await views(CarropagoDS);
			console.log('2 carro');
			await actions(CarropagoDS);
			console.log('3 carro');
			await access_views(CarropagoDS);
			console.log('4 carro');
			console.log('Listo');
		})
		.catch((err) => {
			console.log(err);
			process.exit();
		});

	await LibrepagoDS.initialize()
		.then(async () => {
			console.log('Running PreData Librepago');
			console.log('1 libre');
			await views(LibrepagoDS);
			console.log('2 libre');
			await actions(LibrepagoDS);
			console.log('3 libre');
			await access_views(LibrepagoDS);
			console.log('4 libre');
			console.log('Listo');
			process.exit();
		})
		.catch((err) => {
			console.log(err);
			process.exit();
		});
};

init();
