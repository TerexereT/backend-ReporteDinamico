import { DateTime } from 'luxon';

interface select {
	key: string;
	query: string;
}

export const selects: select[] = [
	{ key: 'TERMINAL', query: `distinct a.aboTerminal TERMINAL` },
	{ key: 'AFILIADO', query: `a.aboCodAfi AFILIADO` },
	{ key: 'NOMBRE', query: `b.comerdesc NOMBRE` },
	{ key: 'RIF_CI', query: `b.comerRif RIF_CI` },
	{ key: 'TLF', query: `c.contTelefMov TLF` },
	{ key: 'NOMBRES_ACI', query: `g.aliNombres+ ' '+aliApellidos NOMBRES_ACI` },
	{ key: 'CEDULA_ACI', query: `g.aliIdentificacion CEDULA_ACI` },
	{ key: 'FECHA_FIN', query: `g.aliCodigoCelular+ ''+alicelular TLF_ACI   from [dbo].[Historico] as a` },
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

	return /* sql */ ` WHERE   hisFechaEjecucion BETWEEN '${initDate}' AND  '${endDate}'`;
};

export const FormatQuery = (selects: string): string => {
	const today: string = DateTime.local().toFormat('yyyy-MM-dd');

	return /* sql */ /*sql*/ `
    select ${selects}
	join Comercios b on b.comerCod=a.aboCodComercio
	join contactos c on c.contCodComer=b.comerCod
	join aliados g on g.id=b.comerCodAliado 
	where a.hisComisionBancaria > '0.00' and  a.aboterminal not in (select aboterminal from  PlanPago where planId in ('1','5','7','8','9')) and a.hisFechaEjecucion > GETDATE()-1
	ORDER BY a.aboTerminal asc`;
};

// select distinct a.aboTerminal TERMINAL, a.aboCodAfi AFILIADO,b.comerdesc NOMBRE, b.comerRif RIF_CI, c.contTelefMov TLF, g.aliNombres+ ' '+aliApellidos NOMBRES_ACI,  g.aliIdentificacion CEDULA_ACI, g.aliCodigoCelular+ ''+alicelular TLF_ACI   from [dbo].[Historico] as a
// join Comercios b on b.comerCod=a.aboCodComercio
// join contactos c on c.contCodComer=b.comerCod
// join aliados g on g.id=b.comerCodAliado
// where a.hisComisionBancaria > '0.00' and  a.aboterminal not in (select aboterminal from  PlanPago where planId in ('1','5','7','8','9')) and a.hisFechaEjecucion > GETDATE()-1
// ORDER BY a.aboTerminal asc
