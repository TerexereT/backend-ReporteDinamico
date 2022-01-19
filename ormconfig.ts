export default {
	type: 'mssql',
	host: process.env.HOST || '10.198.72.31',
	username: process.env.USER || 'amendoza',
	password: process.env.PASS || 'Am1523246.',
	database: process.env.DB || 'milpagos',
	options: {
		trustServerCertificate: true,
	},
	requestTimeout: 30000000,
	connectionTimeout: 30000,
	synchronize: true,
	logging: true,
	entities: ['src/entity/**/*.ts'],
	migrations: ['src/migration/**/*.ts'],
	subscribers: ['src/subscriber/**/*.ts'],
	cli: {
		entitiesDir: 'src/entity',
		migrationsDir: 'src/migration',
		subscribersDir: 'src/subscriber',
	},
};
