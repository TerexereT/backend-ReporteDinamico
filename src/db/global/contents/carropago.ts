import { CarropagoDS } from './../../config/DataSource';
import access_views from './access.views';
import actions from './actions';
import views from './views';
// init server

CarropagoDS.initialize()
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
		process.exit();
	})
	.catch((err) => {
		console.log(err);
		process.exit();
	});
