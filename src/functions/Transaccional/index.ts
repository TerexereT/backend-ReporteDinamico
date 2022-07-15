import { DateTime } from 'luxon';
import { organizations } from './../../controller/Transaccional/index';
require('dotenv').config();

const { NODE_ENV } = process.env;

interface select {
	key: string;
	query: string;
}

export interface typeTrans {
	Aprobados: boolean;
	Rechazos: boolean;
	CierreDeLote: boolean;
	Reversos: boolean;
}

export const selects: select[] = [
	{ key: 'Afiliado', query: `right(card_acceptor_id_code, 9) as Afiliado` },
	{ key: 'Descripcion', query: `card_acceptor_name_loc as Descripcion` },
	{ key: 'Terminal', query: `card_acceptor_term_id as Terminal` },
	{ key: 'Monto', query: `sum(source_node_amount_requested/100) as Monto` },
	{ key: 'Msg_type', query: `msg_type as Msg_type` },
	{ key: 'Cod_resp', query: `rsp_code_req_rsp as Cod_Resp` },
	{ key: 'State', query: `state as State` },
	{
		key: 'Tp_Tx',
		query: `case sink_node when ''sktandem'' then ''Credito'' when ''sktandem1'' then ''Tebca  '' else ''Débito '' end as Tp_Tx`,
	},
	{ key: 'Cantidad', query: `count(*) as Cantidad` },
];

export const FormatQuery = (tipo: string, organizationOption: number, monthoption: string): string => {
	const today = DateTime.now();
	const keys = selects.map((select) => select.query).join(', ');
	//Formatear por tipo (Aprobada, Rechazada, Reverso, CierreDeLote)
	const organization = organizations[organizationOption].query;

	// Formatear el rango de fecha
	const firstDate = DateTime.fromFormat(
		`${monthoption}-01`, // Prueba
		// `${today.year}-${monthoption >= 10 ? monthoption : `0${monthoption}`}-01`,
		'yyyy-MM-dd'
	).toFormat(`yyyy-MM-dd 00:00:00.000`);
	const lastDay = DateTime.fromFormat(firstDate, 'yyyy-MM-dd 00:00:00.000')
		.plus({ months: 1 })
		.minus({ days: 1 })
		.toFormat(`yyyy-MM-dd 23:59:59.999`);

	return /* sql */ /*sql*/ `
	EXEC ${
		NODE_ENV === 'prod' ? 'POSTILION_7018' : 'PRUEBA_7218'
	}.rep_post_dia.dbo.SP_RD_transaccion '${tipo}', '${firstDate}', '${lastDay}', '${organization}'
        `;
};
