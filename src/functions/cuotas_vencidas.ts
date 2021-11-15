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
	{ key: 'MONTOTOTAL', query: `Sum(montoTotal) as MONTOTOTAL` },
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
    group by aboTerminal, aboCodAfi, descripcion
    
    order by TERMINAL
    `;
};
