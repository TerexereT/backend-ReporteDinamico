import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();

const { HOST, USER, PASS, DB } = process.env;

export const MilpagosDS = new DataSource({
	type: 'mssql',
	host: HOST,
	username: USER,
	password: PASS,
	database: 'milpagos',
	options: {
		encrypt: false,
		cancelTimeout: 15000,
	},
	requestTimeout: 600000,
	connectionTimeout: 30000,
	synchronize: false,
	migrationsRun: false,
	logging: false,
	entities: ['src/db/models/**/*.ts'],
	migrations: ['src/db/base/**/*.ts'],
	subscribers: ['src/db/subscriber/**/*.ts'],
});

export const CarropagoDS = new DataSource({
	type: 'mssql',
	host: HOST,
	username: USER,
	password: PASS,
	database: 'carropago',
	options: {
		encrypt: false,
		cancelTimeout: 15000,
	},
	requestTimeout: 600000,
	connectionTimeout: 30000,
	synchronize: false,
	migrationsRun: false,
	logging: false,
	entities: ['src/db/models/**/*.ts'],
	migrations: ['src/db/base/**/*.ts'],
	subscribers: ['src/db/subscriber/**/*.ts'],
});

export const LibrepagoDS = new DataSource({
	type: 'mssql',
	host: HOST,
	username: USER,
	password: PASS,
	database: 'librepago',
	options: {
		encrypt: false,
		cancelTimeout: 15000,
	},
	requestTimeout: 600000,
	connectionTimeout: 30000,
	synchronize: false,
	migrationsRun: false,
	logging: false,
	entities: ['src/db/models/**/*.ts'],
	migrations: ['src/db/base/**/*.ts'],
	subscribers: ['src/db/subscriber/**/*.ts'],
});
