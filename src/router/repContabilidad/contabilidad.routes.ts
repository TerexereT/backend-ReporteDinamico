import { Router } from 'express';
import Contabilidad from '../../controller/Contabilidad';

const ContabilidadRoutes: Router = Router();

ContabilidadRoutes.route('').post(Contabilidad.allHistory);

ContabilidadRoutes.route('/keys').get(Contabilidad.keys);

export default ContabilidadRoutes;
