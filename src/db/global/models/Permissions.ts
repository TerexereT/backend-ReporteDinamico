import {
	Entity,
	PrimaryGeneratedColumn,
	JoinColumn,
	ManyToOne,
	Column,
	Index,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import actions from './Actions';
import roles from '../../sitran/models/Roles';

@Entity()
export default class Permissions {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ name: 'id_department' })
	id_department!: number;

	@Column({ name: 'id_rol' })
	id_rol!: number;

	@ManyToOne(() => actions, (actions) => actions.permissions)
	@JoinColumn({ name: 'id_action' })
	id_action!: actions;

	@Column({ default: 1 })
	active?: number;

	@CreateDateColumn({ select: false })
	createdAt?: Date;

	@UpdateDateColumn({ select: false })
	updatedAt?: Date;
}
