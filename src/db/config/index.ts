import { CarropagoDS, LibrepagoDS, MilpagosDS } from './DataSource';

export const Conections = async () => {
	await MilpagosDS.initialize();
	console.log('Milpagos OK');
	await CarropagoDS.initialize();
	console.log('Carropago OK');
	await LibrepagoDS.initialize();
	console.log('Librepago OK');
};
