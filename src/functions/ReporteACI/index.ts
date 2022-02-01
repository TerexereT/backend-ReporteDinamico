import { DateTime } from 'luxon';
require('dotenv').config();

const { NODE_ENV } = process.env;

interface select {
	key: string;
	query: string;
}

export const selects: select[] = [
	{ key: 'ACINOMBRES', query: `CONCAT(d.aliNombres,' ' ,d.aliApellidos ) AS ACINOMBRES` },
	{ key: 'CLIENTNOMBRES', query: `c.comerDesc AS CLIENTNOMBRES` },
	{ key: 'TERMINAL', query: `aboterminal as TERMINAL` },
	{ key: 'AFILIADO', query: `aboCodAfi as AFILIADO` },
	{ key: 'MONTO', query: `Format(Sum(montoTotal) , 'N2', 'es-es') as MONTO` },
	{ key: 'IVA', query: `Format((Sum(montoTotal) * 0.16) , 'N2', 'es-es') as IVA` },
	{ key: 'MONTOTOTAL', query: `Format((Sum(montoTotal) * 1.16) , 'N2', 'es-es') as MONTOTOTAL` },
	{
		key: 'MONTOTOTAL_BS',
		query: `
		Format(((Sum(montoTotal) * 1.16) * (SELECT * FROM OPENQUERY([7019], 'SELECT TOP 1 valorVenta
        FROM (
        SELECT TOP 2 valorVenta 
        FROM [rep_post_dia].[dbo].[tasas_dicom]
        
        ORDER BY id DESC
        ) sub
        ORDER BY valorVenta desc'))) , 'N2', 'es-es') as MONTOTOTAL_BS
        `,
	},
	{ key: 'CANT_CUOTAS', query: `COUNT(aboterminal) as CANT_CUOTAS` },
	{ key: 'ESTATUS', query: `descripcion as ESTATUS` },
];

const preQuery = () => /*sql*/ `
	DELETE FROM [dbo].[Temp_ReportACIs]

	INSERT INTO Temp_ReportACIs

	select 
	CONCAT(d.aliNombres,' ' ,d.aliApellidos ) AS ACINOMBRES,
	c.comerDesc AS CLIENTNOMBRES,
	aboterminal as TERMINAL,
	aboCodAfi as AFILIADO, 
	Format(Sum(montoTotal) , 'N2', 'es-es') as MONTO,
	Format((Sum(montoTotal) * 0.16) , 'N2', 'es-es') as IVA,
	Format((Sum(montoTotal) * 1.16) , 'N2', 'es-es') as MONTOTOTAL ,
	descripcion as ESTATUS,
	Format(((Sum(montoTotal) * 1.16) * (SELECT * FROM OPENQUERY([POSTILION_7019], 'SELECT TOP 1 valorVenta
	FROM (
	SELECT TOP 2 valorVenta 
	FROM [rep_post_dia].[dbo].[tasas_dicom]
	
	ORDER BY id DESC
	) sub
	ORDER BY valorVenta desc'))) , 'N2', 'es-es')  as MONTOTOTAL_BS,

	COUNT(aboterminal) as CANT_CUOTAS 
	
		from PlanCuota (NOLOCK)
					left outer join Estatus as e ON estatusId = e.id
								INNER JOIN Comercios AS c ON aboCodComercio = c.comerCod 
								LEFT OUTER JOIN  Aliados AS d ON c.comerCodAliado = d.id 
								--INNER JOIN Abonos AS b ON aboTerminal = b.aboTerminal 

					where estatusId in ('25','26') and fechaProceso <= GETDATE()
	group by aboTerminal, aboCodAfi, descripcion, tasaValor, aliNombres, aliApellidos, comerDesc


	order by ACINOMBRES
`;

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
	${preQuery()}

	Select * FROM [MilPagos].[dbo].[Temp_ReportACIs]  (NOLOCK)

    UNION ALL


	SELECT  [aci_nombre]
			,'CLIENTES'
		,'Terminales'
		,'Afiliados'
		,Format((SUM(cast(convert(float,REPLACE(REPLACE(monto, '.', ''), ',', '.')) as decimal(15,2)))) , 'N2', 'es-es')  as Monto
			,Format((SUM(cast(convert(float,REPLACE(REPLACE(iva, '.', ''), ',', '.')) as decimal(15,2)))) , 'N2', 'es-es')  as Iva
			,Format((SUM(cast(convert(float,REPLACE(REPLACE(mont_total, '.', ''), ',', '.')) as decimal(15,2)))) , 'N2', 'es-es')  as MontoTotal
			,'Estatus'
			,Format((SUM(cast(convert(float,REPLACE(REPLACE(monto_total_bs, '.', ''), ',', '.')) as decimal(15,2)))) , 'N2', 'es-es')  as  MontoTotal_BS
			,(SUM(convert(int,(CANT_TRANSACCION) )))  as CantTotal



	FROM [MilPagos].[dbo].[Temp_ReportACIs] (NOLOCK)

	GROUP BY
		aci_nombre

	Order by aci_nombre, aboTerminal desc
	`;
	// select ${selects} from PlanCuota left outer join Estatus as e ON estatusId = e.id INNER JOIN Comercios AS c ON aboCodComercio = c.comerCod LEFT OUTER JOIN  Aliados AS d ON c.comerCodAliado = d.id
	// where estatusId in ('25','26') and fechaProceso <= GETDATE()
	// group by aboTerminal, aboCodAfi, descripcion, tasaValor, aliNombres, aliApellidos, comerDesc

	// order by ACINOMBRES
	// `;
};