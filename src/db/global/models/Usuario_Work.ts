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
import Roles from '../../sitran/models/Roles';
import Usuarios from './Usuarios';

@Entity('Usuario_Work')
export default class Usuario_Work {
	@PrimaryGeneratedColumn()
	id?: number;

	@OneToOne(() => Usuarios)
	@JoinColumn({ name: 'id_usuario' })
	id_usuario!: Usuarios;

	@Column({ nullable: false, default: 1 })
	id_rol?: number;

	@Column({ nullable: false, default: 1 })
	id_department?: number;

	@Column({ default: 1 })
	active?: number;

	@CreateDateColumn({ select: false })
	createdAt?: Date;

	@UpdateDateColumn({ select: false })
	updatedAt?: Date;
}
