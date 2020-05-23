export type Config = {
  colors: {
    on: string;
    off: string;
  };
};

export const colorPalettes = {
  red: {
    on: "#c00000",
    off: "#400000",
  },
  green: {
    on: "#00c000",
    off: "#004000",
  },
  blue: {
    on: "#3333e0",
    off: "#000040",
  },
  white: {
    on: "#e0e0e0",
    off: "#404040",
  },
};

export const defaultConfig: Config = {
  colors: colorPalettes.red,
};
