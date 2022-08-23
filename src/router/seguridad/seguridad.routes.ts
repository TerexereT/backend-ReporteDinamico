import { Router } from 'express';
import {
	createDepartment,
	dataUserData,
	getPermissions,
	getViews,
	updateUserData,
	updateViews,
} from '../../controller/Seguridad';

const Security: Router = Router();
//
Security.route('/workerSecurity/:id').get(dataUserData).put(updateUserData);
//
Security.route('/department/create').post(createDepartment);
//
Security.route('/permissions/:id_dep/:id_rol').get(getPermissions); //.post(updatePermissions);
//
Security.route('/views/:id_dep').get(getViews).post(updateViews);

export default Security;
