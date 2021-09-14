import { DateTime } from 'luxon';

interface select {
	key: string;
	query: string;
}

export const transQuery: string = /*sql*/ `
(select aboTerminal,

hisFechaEjecucion,

(select

count from  LoteCerradoDetalle

	   where aboTerminal = Historico.aboTerminal and hisFechaEjecucion = Historico.hisFechaEjecucion

) as [TRANSACCION]

 

from Historico

 

where hisFechaEjecucion BETWEEN @StartDate AND @EndDate -- and aboTerminal = '59019075'

GROUP BY hisFechaEjecucion, aboTerminal,hisFechaProceso) order by hisFechaEjecucion asc`;

export const selects: select[] = [
	{
		key: 'CEDULA_RIF',
		query: 'c.comerRif AS [CEDULA-RIF]',
	},
	{
		key: 'COMERCIO',
		query: 'c.comerDesc AS COMERCIO',
	},
	{
		key: 'DIRECCION',
		query: 'c.comerDireccion AS DIRECCION',
	},
	{
		key: 'TERMINAL',
		query: 'a.aboTerminal AS TERMINAL',
	},
	{
		key: 'FechaEjec',
		query: 'a.hisFechaEjecucion AS FechaEjec',
	},
	{
		key: 'FechaPreceso',
		query: 'a.hisFechaProceso AS FechaPreceso',
	},
	{
		key: 'COD_COMERCIO',
		query: 'c.comerCod as [COD_COMERCIO]',
	},
	{
		key: 'N_CUENTA',
		query: 'c.comerCuentaBanco as [N_CUENTA]',
	},
	{
		key: 'N_AFILIADO',
		query: 'a.aboCodAfi as [N_AFILIADO]',
	},
	{
		key: 'MONTO_NETO',
		query: 'a.Monto_Neto AS [MONTO_NETO]',
	},
	{
		key: 'MONTO_BRUTO_TDD',
		query: 'a.monto_bruto_tdd as [MONTO_BRUTO_TDD]',
	},
	{
		key: 'MONTO_BRUTO_TDC',
		query: 'a.monto_bruto_tdc as [MONTO_BRUTO_TDC]',
	},
	{
		key: 'COMISION_MANTENIMIENTO',
		query: 'a.comision_mantenimiento as [COMISION_MANTENIMIENTO]',
	},
	{
		key: 'MONTO_BRUTO',
		query: 'a.monto_bruto_tdc + a.monto_bruto_tdd AS [MONTO_BRUTO]',
	},
	{
		key: 'MONTO_ABONAR',
		query: '(a.monto_abono) AS [MONTO_ABONAR]',
	},
	{ key: 'TASA', query: 'f.hisTasaBCV AS [TASA]' },
	{ key: 'ORG', query: 'h.Nombre_Org AS [ORG]' },
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

export const FormatQuery = (DatesRang: string, selects: string): string => {
	return /* sql */ `
    select *

    from 

    (SELECT ${selects}

    FROM

           (SELECT  

                  hisFechaEjecucion, 

                  hisFechaProceso,

                 aboTerminal, 

                  aboCodAfi,

                 (SUM(hisAmountTDD) + SUM(hisAmountTDC)) AS Monto_Neto, ---TARJETA DE CREDITO + TARJETA DE DEBITO

                  (SUM(hisAmountTDD) + SUM(hisAmountComisionBanco) - SUM(hisAmountTDCImpuesto)) as monto_bruto_tdd, --Monto Bruto TDD

                  (SUM(hisAmountTDC) + SUM(hisAmountTDCImpuesto)) as monto_bruto_tdc, --Monto Bruto TDC

                  (SUM(hisIvaSobreMantenimiento) + SUM(hisComisionMantenimiento) + SUM(hisComisionBancaria)) as comision_mantenimiento,--Comision de Mantenimiento

                  SUM(hisComisionMantenimiento) AS comision_servicio, -- COMISION DE SERVISIO es Base Imponible

                  SUM(hisAmountComisionBanco) AS comision_banco, -- COMISION BANCARIA

                  SUM(hisNetoComisionBancaria) AS monto_por_comision, -- COBRO POR COMISION BANCARIA 1,50%

                  SUM(hisIvaSobreMantenimiento) AS monto_por_servicio, -- COMISION POR SERVICIO ($35+iva = $40,60 a tasa BCV)

                  (SUM(hisAmountComisionBanco) - SUM(hisAmountTDCImpuesto)) AS monto_comision_tdd,  --CALCULA LA COMISION DE TDD CUANDO HAY CREDITO

                  SUM(hisAmountTotal) AS monto_abono  -- SIGUE IGUAL 

                  

             

    FROM     

    

    Historico 

    

    WHERE   hisFechaEjecucion BETWEEN '2021-07-10' AND  '2021-07-15'

                  GROUP BY hisFechaEjecucion, aboTerminal,hisFechaProceso,aboCodAfi) AS a INNER JOIN

    Abonos AS b ON a.aboTerminal = b.aboTerminal INNER JOIN

    Comercios AS c ON b.aboCodComercio = c.comerCod LEFT OUTER JOIN

    Aliados AS d ON c.comerCodAliado = d.id LEFT OUTER JOIN

    Bancos AS e ON SUBSTRING(b.aboNroCuenta, 1, 4) = e.banCodBan LEFT OUTER JOIN

    LoteCerradoDetalle AS f ON a.hisFechaEjecucion = f.hisFechaEjecucion and a.aboTerminal = f.aboTerminal LEFT OUTER JOIN

    Cartera_Ter AS g ON a.aboTerminal = Terminal_Id LEFT OUTER JOIN

    Cartera AS h ON g.Cod_Cartera = h.Cod_Cartera

    group by c.comerRif, c.comerDesc, c.comerDireccion, a.aboTerminal, a.hisFechaEjecucion, d.aliIdentificacion,d.aliNombres, d.aliApellidos,c.comerCod,c.comerCuentaBanco,

    a.monto_bruto_tdd,a.monto_bruto_tdC,a.comision_mantenimiento,a.aboCodAfi,a.hisFechaProceso,f.hisTasaBCV,a.Monto_Neto,a.monto_abono,h.Nombre_Org

    ) as c order by c.TERMINAL desc

    `;
};
