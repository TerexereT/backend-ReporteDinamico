import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column, Index } from 'typeorm';
import fm_department from './Department';
import Views from './Views';

@Entity('views_x_department')
@Index(['id_department', 'id_views'], { unique: true })
export default class ViewsXDepartment {
	@PrimaryGeneratedColumn()
	id?: number;

	@ManyToOne(() => fm_department, (fm_department) => fm_department.access_views)
	@JoinColumn({ name: 'id_department' })
	id_department!: number;

	@ManyToOne(() => Views, (Views) => Views.departmentViews)
	@JoinColumn({ name: 'id_views' })
	id_views!: number;

	@Column({ default: 1 })
	active?: number;
}
