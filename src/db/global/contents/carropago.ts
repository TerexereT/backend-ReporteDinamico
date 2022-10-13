import { CarropagoDS } from './../../config/DataSource';
import access_views from './access.views';
import actions from './actions';
import roles from '../../sitran/contents/roles';
import preUser from './user';
import preDataUser from './usuariosPerfil';
import views from './views';
// init server

CarropagoDS.initialize()
	.then(async () => {
		console.log('Running PreData');
		console.log(1);
		await roles(CarropagoDS);
		console.log(2);
		await views(CarropagoDS);
		console.log(3);
		await actions(CarropagoDS);
		console.log(4);
		await access_views(CarropagoDS);
		console.log(5);
		//await permissions(CarropagoDS);
		console.log(6);
		await preUser(CarropagoDS);
		console.log(7);
		await preDataUser(CarropagoDS);
		console.log('Listo carropago');
		process.exit();
	})
	.catch((err) => {
		console.log(err);
		process.exit();
	});
