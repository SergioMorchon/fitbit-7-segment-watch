import { readFileSync, existsSync, writeFileSync } from 'fs';
import { me } from 'appbit';
import { Config, defaultConfig } from '../shared/config';

const FILE_NAME = 'config-0';

export const config: Config = existsSync(FILE_NAME)
	? readFileSync(FILE_NAME, 'cbor')
	: defaultConfig;

me.addEventListener('unload', () => {
	writeFileSync(FILE_NAME, config, 'cbor');
});
