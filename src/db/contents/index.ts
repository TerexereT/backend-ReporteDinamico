import { createConnection } from 'typeorm';
import access_views from './access.views';
import actions from './actions';
import department from './department';
import permissions from './permissions';
import roles from './roles';
import preUser from './user';
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
	await actions();
	console.log(4);
	await access_views();
	console.log(5);
	await permissions();
	console.log(6);
	await preUser();
	console.log(7);
	await preDataUser();
	console.log('Listo');
});
