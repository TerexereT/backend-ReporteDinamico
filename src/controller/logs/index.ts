import { getRepository } from 'typeorm';
import general_logs from '../../db/models/general_logs';

export default async function saveLogs(email: string, method: string, path: string, msg: string) {
	try {
		const log: general_logs = {
			email,
			descript: `[method:${method}]::[path:${path}]::[msg:${msg}]`,
			id_origin_logs: 9, //reportes
		};

		await getRepository(general_logs).save(log);
		return;
	} catch (err) {
		return err;
	}
}
