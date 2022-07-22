import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	UpdateDateColumn,
	OneToMany,
	JoinColumn,
	CreateDateColumn,
	Index,
	ManyToOne,
} from 'typeorm';
import ViewsXDepartment from './ViewsXDepartment';
import Actions from './Actions';

@Entity()
@Index(['root'], { unique: true })
export default class Views {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: true })
	name!: string;

	@Column({ nullable: true })
	root!: string;

	@OneToMany(() => Actions, (Actions) => Actions.id_views)
	@JoinColumn({ name: 'actions' })
	actions?: Actions[];

	@OneToMany(() => ViewsXDepartment, (ViewsXDepartment) => ViewsXDepartment.id_views)
	@JoinColumn({ name: 'departmentViews' })
	departmentViews?: ViewsXDepartment[];

	@Column({ default: 1 })
	active?: number;

	@CreateDateColumn({ select: false })
	createdAt?: Date;

	@UpdateDateColumn({ select: false })
	updatedAt?: Date;
}
