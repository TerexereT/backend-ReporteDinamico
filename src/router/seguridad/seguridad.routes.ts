import { Router } from 'express';
import { dataUserData, updateUserData } from '../../controller/Seguridad';

const Security: Router = Router();
//
Security.route('/workerSecurity/:id').get(dataUserData).put(updateUserData);

export default Security;
