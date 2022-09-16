import { MilpagosDS } from '../config/DataSource';
import Permissions from '../models/Permissions';
//

const permissions = async (): Promise<void> => {
	let data: Permissions[] = [
		{
			id_department: 2,
			id_rol: 2, //work
			id_action: 2, //crear fm
		},
	];

	const valid = await MilpagosDS.getRepository(Permissions).find({ where: data });
	if (!valid.length) await MilpagosDS.getRepository(Permissions).save(data);
};

export default permissions;
