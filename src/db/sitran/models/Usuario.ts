import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Department from './Department';
import Roles from './Roles';
import Status from './Status';

@Entity('Usuarios', { synchronize: true })
@Index(['id_type', 'ident'], { unique: true })
export default class UsuariosSitran {
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

	@ManyToOne(() => Department, (department) => department.usuarios)
	department!: Department;

	@ManyToOne(() => Roles, (roles) => roles.usuarios)
	rol!: Roles;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	@Column({ nullable: false })
	estatus!: number;

	@ManyToOne(() => Status, (status) => status.usuarios)
	status!: Status;
}
