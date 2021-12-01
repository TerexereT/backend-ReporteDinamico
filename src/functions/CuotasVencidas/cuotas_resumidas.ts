import { DateTime } from 'luxon';

interface select {
	key: string;
	query: string;
}

/*
aboterminal as TERMINAL,
aboCodAfi as AFILIADO, 
Sum(montoTotal) as MONTOTOTAL,
COUNT(aboterminal) as CANT_CUOTAS,
descripcion as ESTATUS
*/

export const selects: select[] = [
	{ key: 'TERMINAL', query: `aboterminal as TERMINAL` },
	{ key: 'AFILIADO', query: 'aboCodAfi as AFILIADO' },
	{ key: 'MONTO', query: `Sum(montoTotal) as MONTO` },
	{ key: 'IVA', query: `(Sum(montoTotal) * 0.16) as IVA` },
	{ key: 'MONTOTOTAL', query: `(Sum(montoTotal) * 1.16) as MONTOTOTAL` },
	{
		key: 'MONTOTOTAL_BS',
		query: `
        ((Sum(montoTotal) * 1.16)* (SELECT * FROM OPENQUERY([POSTILION_7019], 'SELECT TOP 1 valorVenta
        FROM (
          SELECT TOP 2 valorVenta 
          FROM [rep_post_dia].[dbo].[tasas_dicom]
           
          ORDER BY id DESC
        ) sub
        ORDER BY valorVenta desc'))) as MONTOTOTAL_BS
        `,
	},
	{ key: 'CANT_CUOTAS', query: `COUNT(aboterminal) as CANT_CUOTAS` },
	{ key: 'ESTATUS', query: `descripcion as ESTATUS` },
];

export const selectQuery = (keys: string[]) => {
	return selects
		.filter((select): boolean => keys.includes(select.key))
		.map((select) => select.query)
		.join(', ');
};

export const dateRang = (init: string, end: string): string => {
	// use luxon js to format the date in format YYYY-MM-DD
	const initDate = DateTime.fromFormat(init, 'YYYY-MM-DD');
	const endDate = DateTime.fromFormat(end, 'YYYY-MM-DD');

	return /* sql */ ` WHERE  hisFechaEjecucion BETWEEN '${initDate}' AND  '${endDate}'`;
};

export const FormatQuery = (selects: string): string => {
	const today: string = DateTime.local().toFormat('yyyy-MM-dd');

	return /*sql*/ `
    select ${selects} from PlanCuota
    left outer join Estatus as e ON estatusId = e.id
    where estatusId in ('25','26') and fechaProceso <= GETDATE()
    group by aboTerminal, aboCodAfi, descripcion, tasaValor

    order by TERMINAL

    `;
};
