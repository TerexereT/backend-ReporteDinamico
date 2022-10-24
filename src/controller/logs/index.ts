import { DataSource } from 'typeorm';
import general_logs from '../../db/global/models/general_logs';

export default async function saveLogs(email: string, method: string, path: string, msg: string, DS: DataSource) {
	try {
		const log: general_logs = {
			email,
			descript: `[method:${method}]::[path:${path}]::[msg:${msg}]`,
			id_origin_logs: 9, //reportes
		};

		await DS.getRepository(general_logs).save(log);
		return;
	} catch (err) {
		return err;
	}
}
