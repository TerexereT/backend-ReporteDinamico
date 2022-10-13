import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import UsuariosSitran from './Usuario';

@Entity()
export default class Roles {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: true })
	name!: string;

	@Column({ default: 1 })
	active?: number;

	@OneToMany(() => UsuariosSitran, (usuario) => usuario.rol)
	usuarios?: UsuariosSitran[];

	@CreateDateColumn({ select: false })
	createdAt?: Date;

	@UpdateDateColumn({ select: false })
	updatedAt?: Date;
}
