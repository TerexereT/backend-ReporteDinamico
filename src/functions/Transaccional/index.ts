import { DateTime } from 'luxon';
import { organizations } from './../../controller/Transaccional/index';

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
		query: `case sink_node when 'sktandem' then 'Crédito' when 'sktandem1' then 'Tebca  ' else 'Débito ' end as Tp_Tx`,
	},
	{ key: 'Cantidad', query: `count(*) as Cantidad` },
];

export const FormatQuery = (tipo: string, organizationOption: number, monthoption: number): string => {
	//Formatear por tipo (Aprobada, Rechazada, Reverso, CierreDeLote)
	const organization = organizations[organizationOption].query;
	const keys = selects.map((select) => select.query).join(', ');

	// Formatear el rango de fecha
	const today = DateTime.now();
	const firstDate = DateTime.fromFormat(
		`${today.year}-${monthoption >= 10 ? monthoption : `0${monthoption}`}-01`,
		'yyyy-MM-dd'
	).toFormat(`yyyy-MM-dd 00:00:00.000`);
	const lastDay = DateTime.fromFormat(firstDate, 'yyyy-MM-dd 00:00:00.000')
		.plus({ months: 1 })
		.minus({ days: 1 })
		.toFormat(`yyyy-MM-dd 23:59:59.999`);

	let condition = ``;

	switch (tipo) {
		case 'Rechazos':
			condition = `
            and right(card_acceptor_id_code, 9) like '${organization}'
            and rsp_code_req_rsp <> '00' or state <> '99'
            `;
			break;
		case 'CierreDeLote':
			condition = `
            and right(card_acceptor_id_code, 9) like '${organization}'
            and rsp_code_req_rsp = '00'
            and msg_type = '1312'
            and  state= '99'
            `;
			break;
		case 'Reversos':
			condition = `
            and right(card_acceptor_id_code, 9) like '${organization}'
            and rsp_code_req_rsp = '00'
            and msg_type = '1056'
            and  state= '99'
            `;
			break;
		default:
			condition = `
            and right(card_acceptor_id_code, 9) like '${organization}'
            and rsp_code_req_rsp = '00'
            and msg_type = '512'
            and state= '99'
            `;
			break;
	}

	return /* sql */ /*sql*/ `
        select ${keys}
        from tm_trans(nolock)
        where  card_acceptor_id_code not IN  ('000000720004108',
                                       '000000720008172',
                                       '000000720008173',
                                       '000000720008174',
                                       '000000720008175',
                                       '000000720008176',
                                       '000000720008177',
                                       '000000720008178',
                                       '000000720008179') 
        and (in_req between '${firstDate}' and '${lastDay}'
            or in_adv between '${firstDate}' and '${lastDay}'
            or in_rev between '${firstDate}' and '${lastDay}'
            or in_recon_adv between '${firstDate}' and '${lastDay}')
        
        ${condition}
    
        group by card_acceptor_id_code, card_acceptor_name_loc, card_acceptor_term_id, msg_type, rsp_code_req_rsp , state,
        sink_node
        `;
};
