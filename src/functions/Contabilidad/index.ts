import { DateTime } from 'luxon';

interface select {
	key: string;
	query: string;
}

export const selects: select[] = [
	{
		key: 'NOMBRE-ACI',
		query: `Nombre-ACI`,
	},
	{
		key: 'COMERCIO',
		query: `COMERCIO`,
	},
	{
		key: 'CEDULA-RIF',
		query: 'CEDULA-RIF',
	},
	{
		key: 'TERMINAL',
		query: 'TERMINAL',
	},
	{
		key: 'CANT_VENCIDAS',
		query: 'Cant_Vencidas',
	},
	{
		key: 'CANT_PAGADAS',
		query: 'Cant_Pagadas',
	},
	{
		key: 'MONTOTOTAL',
		query: 'MontoTotal',
	},
	{
		key: 'COMISION_ACI',
		query: 'COMISION_ACI',
	},
];

export const dateRang = (init: string, end: string): any => {
	return { init: DateTime.fromFormat(init, 'YYYY-MM-DD'), end: DateTime.fromFormat(end, 'YYYY-MM-DD') };
};

export const FormatQueryDetalleXACI = (dateRang: any): string => {
	const { init, end } = dateRang;
	return /* sql */ `

	EXEC SP_ReportDetalleACIs ${init}, ${end}
`;
};
