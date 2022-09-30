import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Department from './Department';

@Entity('Usuarios')
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

	//falta roles

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	@Column({ nullable: false })
	estatus!: number;
}
