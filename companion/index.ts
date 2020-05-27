import { settingsStorage } from 'settings';
import { outbox } from 'file-transfer';
import { encode } from 'cbor';
import {
	SETTING_KEY_COLOR_ON,
	SETTING_KEY_COLOR_OFF,
	SETTING_KEY_SHOW_DATE,
	SETTING_KEY_SHOW_SECONDS,
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
if (!settingsStorage.getItem(SETTING_KEY_SHOW_DATE)) {
	settingsStorage.setItem(
		SETTING_KEY_SHOW_DATE,
		JSON.stringify(defaultConfig.showDate),
	);
}
if (!settingsStorage.getItem(SETTING_KEY_SHOW_SECONDS)) {
	settingsStorage.setItem(
		SETTING_KEY_SHOW_SECONDS,
		JSON.stringify(defaultConfig.showSeconds),
	);
}

settingsStorage.addEventListener('change', () => {
	const colorOn = settingsStorage.getItem(SETTING_KEY_COLOR_ON);
	const colorOff = settingsStorage.getItem(SETTING_KEY_COLOR_OFF);
	const showDate = settingsStorage.getItem(SETTING_KEY_SHOW_DATE);
	const showSeconds = settingsStorage.getItem(SETTING_KEY_SHOW_SECONDS);
	if (!colorOn || !colorOff || !showDate || !showSeconds) {
		return;
	}

	const config: Config = {
		colors: {
			on: JSON.parse(colorOn),
			off: JSON.parse(colorOff),
		},
		showSeconds: JSON.parse(showSeconds),
		showDate: JSON.parse(showDate),
	};
	outbox.enqueue('config', encode(config));
});
