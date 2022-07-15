import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('HISTORICO_CONTRACARGO', { synchronize: false })
export default class Historico_Contracargo {
	@PrimaryGeneratedColumn()
	ID!: number;

	@Column({ nullable: false })
	TERMINAL!: string;

	@Column({ nullable: false })
	MONTO_COBRA!: number;

	@Column({ nullable: false })
	MONTO_PAGO!: number;
}
