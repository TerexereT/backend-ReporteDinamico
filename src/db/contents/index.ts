import { createConnection } from 'typeorm';
import access_views from './access.views';
import actions from './actions';
import department from './department';
import permissions from './permissions';
import roles from './roles';
import preDataUser from './usuariosPerfil';
import views from './views';
// init server

createConnection().then(async () => {
	console.log('Running PreData');
	await department();
	console.log(1);
	await roles();
	console.log(2);
	await views();
	console.log(3);
	await preDataUser();
	console.log(4);
	await actions();
	console.log(5);
	await access_views();
	console.log(6);
	await permissions();
	console.log('Listo');
	return 0;
});
