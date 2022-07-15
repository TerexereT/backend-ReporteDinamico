import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import orign_logs from './origin_logs';
import Usuarios from './Usuarios';

@Entity({ synchronize: false })
export default class general_logs {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column()
	email!: string;

	@Column()
	descript!: string;

	@ManyToOne(() => orign_logs, (orign_logs) => orign_logs.general_logs)
	@JoinColumn({ name: 'id_origin_logs' })
	id_origin_logs!: number;

	@CreateDateColumn()
	createdAt?: Date;
}
