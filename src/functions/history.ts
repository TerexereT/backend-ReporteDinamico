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

 

from [MilPagos].[dbo].[Historico] with (NOLOCK)

 

where hisFechaEjecucion BETWEEN @StartDate AND @EndDate -- and aboTerminal = '59019075'

GROUP BY hisFechaEjecucion, aboTerminal,hisFechaProceso) order by hisFechaEjecucion asc`;

export const selects: select[] = [
	{
		key: 'N_AFILIADO',
		query: '[N_AFILIADO]',
	},
	{
		key: 'TERMINAL',
		query: 'TERMINAL',
	},
	{
		key: 'CEDULA_RIF',
		query: '[CEDULA_RIF]',
	},
	{
		key: 'COMERCIO',
		query: 'COMERCIO',
	},
	{
		key: 'DIRECCION',
		query: 'DIRECCION',
	},
	{
		key: 'COD_COMERCIO',
		query: '[COD_COMERCIO]',
	},
	{
		key: 'N_CUENTA',
		query: '[N_CUENTA]',
	},
	{
		key: 'FECHA_PROCESO',
		query: 'FechaPreceso',
	},
	{
		key: 'FECHA',
		query: 'FechaEjec',
	},
	{
		key: 'LOTE',
		query: '[LOTE]',
	},
	{
		key: 'MONTO_BRUTO_TDD',
		query: 'CONVERT(VARCHAR,CAST(MontoBrutoTDD AS MONEY),1) as MONTO_BRUTO_TDD',
	},
	{
		key: 'MONTO_BRUTO_TDC',
		query: 'CONVERT(VARCHAR,CAST(MontoBrutoTDC AS MONEY),1) as MONTO_BRUTO_TDC',
	},
	{
		key: 'MONTO_BRUTO_VISA_ELEC',
		query: 'CONVERT(VARCHAR,CAST(MontoBrutoVisaElectro AS MONEY),1) as MONTO_BRUTO_VISA_ELEC',
	},
	{
		key: 'TOTAL_MONTOS_BRUTOS',
		query:
			'CONVERT(VARCHAR,CAST((MontoBrutoTDD + MontoBrutoTDC + MontoBrutoVisaElectro) AS MONEY),1) as TOTAL_MONTOS_BRUTOS',
	},
	{
		key: 'COMISION_AFILIADO_TDD',
		query: `CASE
		WHEN SUM(MontoBrutoTDD) <> 0.00 THEN 
		round(sum(monto_comision_tdd) - (SUM(MontoBrutoVisaElectro) * 0.02), 2)
		
		ELSE 0.00
	END as [COMISION_AFILIA_TDD]`,
	},
	{
		key: 'COMISION_AFILIADO_TDC',
		query: /*sql*/ `case when

		(SUM(MontoBrutoTDD) <> 0.00 and SUM(MontoBrutoTDC) = 0.00 and SUM(MontoBrutoVisaElectro) = 0.00  ) then
		
		0.00
		
		when
		
		(SUM(MontoBrutoTDC) <> 0 and SUM(MontoBrutoVisaElectro) = 0.00) then
		
		Monto_afilia_tdc
		
		when
		
		( SUM(MontoBrutoVisaElectro) <> 0  ) then

		Monto_afilia_tdc
	
		else 0.00
		
		end  as COMISION_AFILIA_TDC`,
	},
	{
		key: 'COMISION_AFILIADO_VISA_ELECTRO',
		query: `CASE

		WHEN ( SUM(MontoBrutoVisaElectro) <> 0  ) THEN
	
		 round((SUM(cast(convert(float,(MontoBrutoVisaElectro * 0.02)) as decimal(15,2)))), 2)
	
		ELSE 0.00
	
	END as COMISION_AFILIA_VISA_ELEC`,
	},
	{
		key: 'MONTO_NETO_TDD',
		query: 'Monto_Neto_tdd as MONTO_NETO_TDD',
	},
	{
		key: 'MONTO_NETO_TDC',
		query: `case when 
		(SUM(MontoBrutoTDD) <> 0.00 and SUM(MontoBrutoTDC) = 0.00 and SUM(MontoBrutoVisaElectro) = 0.00  ) then
		0.00
		--'Solo debito'
		when 
		 (SUM(MontoBrutoTDC) <> 0 and SUM(MontoBrutoVisaElectro) = 0.00) then
		round(Monto_neto_tdc, 2 )
		--'Solo master y visa'
		when 
		( SUM(MontoBrutoVisaElectro) <> 0.00  ) then
		
		round((Monto_neto_tdc +  (SUM(MontoBrutoVisaElectro) * 0.02) - SUM(MontoBrutoVisaElectro) ),2)
		
		else 0.00
		end  as MONTO_NETO_TDC`,
	},
	{
		key: 'MONTO_NETO_VISA_ELECTRO',
		query: 'round(( MontoBrutoVisaElectro - (SUM(MontoBrutoVisaElectro) * 0.02)), 2 ) as MONTO_NETO_VISA_ELEC',
	},
	{
		key: 'COMISION_MANTENIMIENTO',
		query: '[COMISION_MANTENIMIENTO]',
	},
	{
		key: 'IVA',
		query: '[IVA]',
	},
	{
		key: 'COMISION_BANCARIA_1_50_USO',
		query: '[COMISION_BANCARIA_1_50_USO]',
	},
	{
		key: 'MONTO_ABONAR',
		query: '[MONTO_ABONAR]',
	},
	{ key: 'TASA', query: '[TASA]' },
	{ key: 'CANT_TRANSACCION', query: '[CANT_TRANSACCION]' },
	{ key: 'TIPO_DE_CARTERA', query: '[TIPO_DE_CARTERA]' },
	{
		key: 'NOMBRE_ACI',
		query: 'NOMBRES',
	},
	{
		key: 'APELLIDOS_ACI',
		query: 'APELLIDOS',
	},
];

const preQuery = (init, end) => /*sql*/ `


DELETE FROM [dbo].[Temp_CerradoDetalle]


INSERT INTO Temp_CerradoDetalle

 SELECT

      [aboTerminal]

      ,[hisLote]

      ,case when hisOrigen = 'Debito' then

         (SUM(cast(convert(float,REPLACE(REPLACE(hisMonto, '.', ''), ',', '.')) as decimal(15,2)))) else 0 end  as mont_bruto_tdd

         ,case when hisOrigen = 'Visa' or hisOrigen = 'Master' then

         (SUM(cast(convert(float,REPLACE(REPLACE(hisMonto, '.', ''), ',', '.')) as decimal(15,2)))) else 0 end  as mont_bruto_tdc

         ,case when hisOrigen = 'ViD?b' or hisOrigen = 'ViDéb' then

         (SUM(cast(convert(float,REPLACE(REPLACE(hisMonto, '.', ''), ',', '.')) as decimal(15,2)))) else 0 end as mont_bruto_tdc_visa_ele

         ,case when hisOrigen = 'ViD?b' or hisOrigen = 'ViDéb' then

         (SUM(cast(convert(float,REPLACE(REPLACE(hisMonto, '.', ''), ',', '.')) as decimal(15,2))) * 0.02) else 0 end as mont_comision_tdc_visa_ele

         ,[hisTasaBCV]

      ,[hisFechaEjecucion]

         ,hisFechaProceso

         ,count(hisOrigen) as CANT_TRANSACCION

  FROM [MilPagos].[dbo].[LoteCerradoDetalle] (NOLOCK)

 

 

  where hisFechaEjecucion between '${init}' and '${end}'

 

  Group by [aboTerminal]

      ,[hisLote]

      ,[hisTasaBCV]

      ,[hisFechaEjecucion]

         ,[hisOrigen]

         ,hisFechaProceso

 

order by aboTerminal asc
`;

export const selectQuery = (keys: string[]) => {
	return selects
		.filter((select): boolean => keys.includes(select.key))
		.map((select) => select.query)
		.join(', ');
};

export const dateRang = (init: string, end: string): any => {
	return { init: DateTime.fromFormat(init, 'YYYY-MM-DD'), end: DateTime.fromFormat(end, 'YYYY-MM-DD') };
};

export const FormatQuery = (dateRang: any, selects: string): string => {
	const { init, end } = dateRang;
	console.log({ init, end });

	return /* sql */ `
	${preQuery(init, end)}

    select ${selects}

	from (
		Select 
		a.aboCodAfi as [N_AFILIADO],
		a.aboTerminal AS TERMINAL, 	-- BIEN 3
		d.aliNombres AS NOMBRES,
		d.aliApellidos AS APELLIDOS,
		c.comerRif AS [CEDULA_RIF], -- BIEN 2
		c.comerDesc AS COMERCIO, -- BIEN 1
		c.comerDireccion AS DIRECCION,
		c.comerCod as [COD_COMERCIO], 
		c.comerCuentaBanco as [N_CUENTA] ,--comerCuentaBanco
		a.hisFechaProceso AS FechaPreceso, -- Fecha de ejecucion 
		a.hisFechaEjecucion AS FechaEjec, -- Fecha de ejecucion 
		a.hisLote as [LOTE],
		round(SUM(te.mont_bruto_tdd),2)  as MontoBrutoTDD,
		round(SUM(te.mont_bruto_tdc),2)  as MontoBrutoTDC,
		round(SUM(te.mont_bruto_tdc_visa_ele),2) as MontoBrutoVisaElectro,
		Monto_Neto_tdd as Monto_Neto_tdd,
		round( Monto_neto_tdc, 2) as Monto_neto_tdc,
		round( Monto_afilia_tdc, 2) as Monto_afilia_tdc,
		round(SUM(mont_comision_tdc_visa_ele),2) as mont_comision_tdc_visa_ele,
		a.monto_comision_tdd as monto_comision_tdd,
		a.comision_servicio as [COMISION_MANTENIMIENTO],
		a.comision_bacaria_1_50 as [COMISION_BANCARIA_1_50_USO],
		a.monto_por_servicio as [IVA] ,
		(a.monto_abono) AS [MONTO_ABONAR], -- CHECK 8
		te.hisTasaBCV AS [TASA],
		h.Nombre_Org AS [TIPO_DE_CARTERA],
		SUM(te.CANT_TRANSACCION) as CANT_TRANSACCION
	 
	
	FROM
	   	(SELECT 
				hisFechaEjecucion,
	
				hisFechaProceso,
	
				aboTerminal,
	
				aboCodAfi,
	
				hisLote,
	
				(SUM(hisAmountTDD) + SUM(hisAmountTDC)) AS Monto_Neto, ---TARJETA DE CREDITO + TARJETA DE DEBITO
	
				SUM(hisAmountTDD) as Monto_Neto_tdd,
	
				SUM(hisAmountTDC) as Monto_neto_tdc,
	
				  --( (hisAmountTDC + hisAmountComisionBanco) – monto bruto visa electro) - hisAmountTDCImpuesto
	
				((SUM(hisAmountTDC) + SUM(hisAmountComisionBanco)) - Sum(hisAmountTDCImpuesto)) as montp_neve,

				(SUM(hisAmountTDD) + SUM(hisAmountComisionBanco) - SUM(hisAmountTDCImpuesto)) as monto_bruto_tdd, --Monto Bruto TDD

				(SUM(hisAmountTDC) + SUM(hisAmountTDCImpuesto)) as monto_bruto_tdc, --Monto Bruto TDC

				(SUM(hisIvaSobreMantenimiento) + SUM(hisComisionMantenimiento) + SUM(hisComisionBancaria)) as comision_mantenimiento,--Comision de Mantenimiento

				SUM(hisComisionMantenimiento) AS comision_servicio, -- COMISION DE SERVISIO es Base Imponible

				SUM(hisAmountComisionBanco) AS comision_banco, -- COMISION BANCARIA

				SUM(hisNetoComisionBancaria) AS monto_por_comision, -- COBRO POR COMISION BANCARIA 1,50%

				SUM(hisIvaSobreMantenimiento) AS monto_por_servicio, -- COMISION POR SERVICIO ($35+iva = $40,60 a tasa BCV)

				(SUM(hisAmountComisionBanco) - SUM(hisAmountTDCImpuesto)) AS monto_comision_tdd,  --CALCULA LA COMISION DE TDD CUANDO HAY CREDITO

				SUM(hisAmountTotal) AS monto_abono,  -- SIGUE IGUAL

				Sum(hisAmountTDCImpuesto) as Monto_afilia_tdc,

				Sum(hisComisionBancaria) as comision_bacaria_1_50
	
	FROM    
	
	 
	
	Historico (NOLOCK)
	
	 
	
	WHERE   hisFechaEjecucion BETWEEN  '${init}' and '${end}' GROUP BY hisFechaEjecucion, aboTerminal,hisFechaProceso,aboCodAfi, hisLote ) AS a INNER JOIN
	
	Abonos AS b ON a.aboTerminal = b.aboTerminal INNER JOIN
	
	Comercios AS c ON b.aboCodComercio = c.comerCod LEFT OUTER JOIN
	
	Aliados AS d ON c.comerCodAliado = d.id LEFT OUTER JOIN
	
	Bancos AS e ON SUBSTRING(b.aboNroCuenta, 1, 4) = e.banCodBan -- LEFT OUTER JOIN
	
	LEFT OUTER JOIN --LoteCerradoDetalle AS f ON a.aboTerminal = f.aboTerminal and a.hisFechaEjecucion = f.hisFechaEjecucion and a.hisLote = f.hisLote  LEFT OUTER JOIN
	
	Cartera_Ter AS g ON a.aboTerminal = Terminal_Id LEFT OUTER JOIN
	
	Cartera AS h ON g.Cod_Cartera = h.Cod_Cartera LEFT OUTER JOIN
	
	Temp_CerradoDetalle as te ON te.aboterminal = a.aboTerminal and a.hisFechaEjecucion = te.hisFechaEjecucion and a.hisLote = te.hisLote
	
	 
	
	Group by  a.aboTerminal, a.hisLote, MONTO_NETO_TDC,Monto_Neto_tdd, Monto_afilia_tdc,a.comision_servicio,
	
	comision_bacaria_1_50, monto_por_servicio, monto_abono, hisTasaBCV, Nombre_Org, a.aboCodAfi, c.comerRif, c.comerDesc, c.comerDireccion, c.comerCod,
	
	comerCuentaBanco, a.hisFechaProceso, a.hisFechaEjecucion, monto_comision_tdd, aliApellidos ,aliNombres
	
	) as mm
	
	 
	
	group by mm.Terminal, mm.Lote, mm.Monto_neto_tdc,Monto_Neto_tdd,Monto_afilia_tdc, COMISION_MANTENIMIENTO, COMISION_BANCARIA_1_50_USO, IVA, MONTO_ABONAR,
	
	TASA, TIPO_DE_CARTERA, N_AFILIADO, CEDULA_RIF, COMERCIO, DIRECCION, COD_COMERCIO, N_CUENTA, FechaPreceso, FechaEjec, MontoBrutoTDD
	
	,MontoBrutoTDC, MontoBrutoVisaElectro ,monto_comision_tdd, CANT_TRANSACCION, NOMBRES, APELLIDOS
	
	 
	
	Order By Terminal asc
	
	 `;
};
