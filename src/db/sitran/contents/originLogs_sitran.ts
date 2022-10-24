import { DataSource } from 'typeorm';
import origin_logs from '../models/origin_logs';

export const listOrigin: origin_logs[] = [
	{
		//1
		name: 'Sitran',
	},
];

const originLogs_sitran = async (db: DataSource): Promise<void> => {
	//
	const valid = await db.getRepository(origin_logs).find({ where: listOrigin });
	if (!valid.length) await db.getRepository(origin_logs).save(listOrigin);
};

export default originLogs_sitran;
