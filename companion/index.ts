import { settingsStorage } from 'settings';
import { outbox } from 'file-transfer';
import { encode } from 'cbor';
import {
	SETTING_KEY_COLOR_ON,
	SETTING_KEY_COLOR_OFF,
} from '../shared/settings';

import type { Config } from '../shared/config';

settingsStorage.addEventListener('change', () => {
	const colorOn = settingsStorage.getItem(SETTING_KEY_COLOR_ON);
	const colorOff = settingsStorage.getItem(SETTING_KEY_COLOR_OFF);
	if (!colorOn || !colorOff) {
		return;
	}

	const config: Config = {
		colors: {
			on: JSON.parse(colorOn),
			off: JSON.parse(colorOff),
		},
	};
	outbox.enqueue('config', encode(config));
});
