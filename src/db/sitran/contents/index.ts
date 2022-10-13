import { SitranDS } from './../../config/DataSource';
import agregadores from './agregadores';
import department from './department';
import roles from './roles';
import user from './user';
// init server

SitranDS.initialize()
	.then(async () => {
		console.log('Running PreData');
		await department(SitranDS);
		console.log(1);
		await roles(SitranDS);
		console.log(1);
		await agregadores(SitranDS);
		console.log(2);
		await user(SitranDS);
		console.log('Listo');
		process.exit();
	})
	.catch((err) => {
		console.log(err);
		process.exit();
	});
