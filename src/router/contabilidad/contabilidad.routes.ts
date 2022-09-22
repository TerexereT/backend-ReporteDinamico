import { Router } from 'express';
import Contabilidad from '../../controller/Contabilidad';

const ContabilidadRoutes: Router = Router();

ContabilidadRoutes.route('/detallexaci').get(Contabilidad.DetalleXACI);

ContabilidadRoutes.route('/detallexaci/keys').get(Contabilidad.keys);

export default ContabilidadRoutes;
