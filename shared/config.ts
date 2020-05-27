export type Config = {
	colors: {
		on: string;
		off: string;
	};
	showSeconds: boolean;
	showDate: boolean;
	dateFormat: 'ddmm' | 'mmdd';
};

export const activeColors = {
	white: '#e0e0e0',
	red: '#c00000',
	green: '#00c000',
	blue: '#3333e0',
};

export const inactiveColors = {
	none: '#000000',
	gray: '#303030',
	red: '#300000',
	green: '#003000',
	blue: '#000030',
};

export const defaultConfig: Config = {
	colors: {
		on: activeColors.white,
		off: inactiveColors.gray,
	},
	showSeconds: false,
	showDate: false,
	dateFormat: 'mmdd',
};
