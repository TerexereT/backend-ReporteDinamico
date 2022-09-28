import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Agregador from './Agregador';

@Entity()
export default class Usuarios {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: false })
	login!: string;

	@Column({ nullable: false })
	password!: string;

	@Column({ nullable: false })
	name!: string;

	@Column({ nullable: false })
	id_type!: string;

	@Column({ nullable: false })
	ident!: string;

	@Column({ nullable: false })
	email!: string;

	@Column({ nullable: true })
	expireAt?: Date | null;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	@Column({ nullable: false })
	estatus!: number;

	@ManyToMany(() => Agregador)
	@JoinTable()
	agregadores?: Agregador[];
}
