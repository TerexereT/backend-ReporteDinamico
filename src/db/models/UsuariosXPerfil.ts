import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Department from './Department';
import Roles from './Roles';
import Usuarios from './Usuarios';

@Entity('usuario_x_work')
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
