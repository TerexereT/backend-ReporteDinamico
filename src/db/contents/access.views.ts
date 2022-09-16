import { MilpagosDS } from '../config/DataSource';
import ViewsXDepartment from '../models/ViewsXDepartment';
import { listDeparment } from './department';
import { listViews } from './views';

const access_views = async (): Promise<void> => {
	let data: ViewsXDepartment[] = [];

	//Todos tiene vista al home
	listDeparment.forEach((element, index) => {
		data.push({
			id_department: index + 1,
			id_views: 1,
		});
	});

	listViews.forEach((element, index) => {
		if (index !== 0)
			data.push({
				id_department: 3,
				id_views: index + 1,
			});
	});

	//
	const valid = await MilpagosDS.getRepository(ViewsXDepartment).find({ where: data });
	if (!valid.length) await MilpagosDS.getRepository(ViewsXDepartment).save(data);
};

export default access_views;
