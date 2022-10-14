import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import UsuariosSitran from './Usuario';

@Entity()
export default class Status {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: true })
	name!: string;

	@OneToMany(() => UsuariosSitran, (usuario) => usuario.status)
	usuarios?: UsuariosSitran[];
}
