import { LibrepagoDS } from './../../config/DataSource';
import access_views from './access.views';
import actions from './actions';
import roles from './roles';
import preUser from './user';
import preDataUser from './usuariosPerfil';
import views from './views';
// init server

LibrepagoDS.initialize()
	.then(async () => {
		console.log('Running PreData');
		console.log(1);
		await roles(LibrepagoDS);
		console.log(2);
		await views(LibrepagoDS);
		console.log(3);
		await actions(LibrepagoDS);
		console.log(4);
		await access_views(LibrepagoDS);
		console.log(5);
		//await permissions(LibrepagoDS);
		console.log(6);
		await preUser(LibrepagoDS);
		console.log(7);
		await preDataUser(LibrepagoDS);
		console.log('Listo librepago');
		process.exit();
	})
	.catch((err) => {
		console.log(err);
		process.exit();
	});
