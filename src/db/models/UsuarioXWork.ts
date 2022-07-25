import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Department from './Department';
import Roles from './Roles';
import Usuarios from './Usuarios';

@Entity('Usuario_Work')
export default class UsuarioXWork {
	@PrimaryGeneratedColumn()
	id?: number;

	@OneToOne(() => Usuarios)
	@JoinColumn({ name: 'id_usuario' })
	id_usuario!: number;

	@OneToOne(() => Roles)
	@JoinColumn({ name: 'id_rol' })
	id_rol!: number;

	@OneToOne(() => Department)
	@JoinColumn({ name: 'id_department' })
	id_department!: number;

	@Column({ default: 1 })
	active?: number;

	@CreateDateColumn({ select: false })
	createdAt?: Date;

	@UpdateDateColumn({ select: false })
	updatedAt?: Date;
}
