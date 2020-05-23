import { settingsStorage } from 'settings';
import { outbox } from 'file-transfer';
import { encode } from 'cbor';
import {
	SETTING_KEY_COLOR_ON,
	SETTING_KEY_COLOR_OFF,
} from '../shared/settings';

import { Config, defaultConfig } from '../shared/config';

if (!settingsStorage.getItem(SETTING_KEY_COLOR_ON)) {
	settingsStorage.setItem(
		SETTING_KEY_COLOR_ON,
		JSON.stringify(defaultConfig.colors.on),
	);
}
if (!settingsStorage.getItem(SETTING_KEY_COLOR_OFF)) {
	settingsStorage.setItem(
		SETTING_KEY_COLOR_OFF,
		JSON.stringify(defaultConfig.colors.off),
	);
}

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
