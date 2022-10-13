import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	UpdateDateColumn,
	CreateDateColumn,
	Index,
	OneToMany,
	JoinColumn,
} from 'typeorm';
import UsuariosSitran from './Usuario';

@Entity()
@Index(['name'], { unique: true })
export default class Department {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: true })
	name!: string;

	@Column({ default: 1 })
	active?: number;

	@CreateDateColumn({ select: false })
	createdAt?: Date;

	@UpdateDateColumn({ select: false })
	updatedAt?: Date;

	@OneToMany(() => UsuariosSitran, (usuario) => usuario.department)
	usuarios?: UsuariosSitran[];
}
