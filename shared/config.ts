export type Config = {
	colors: {
		on: string;
		off: string;
	};
};

export const colorPalettes = {
	white: {
		on: '#e0e0e0',
		off: '#202020',
	},
	red: {
		on: '#c00000',
		off: '#300000',
	},
	green: {
		on: '#00c000',
		off: '#003000',
	},
	blue: {
		on: '#3333e0',
		off: '#000030',
	},
};

export const defaultConfig: Config = {
	colors: colorPalettes.white,
};
