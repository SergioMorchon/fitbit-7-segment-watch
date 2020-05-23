import { defaultConfig, activeColors, inactiveColors } from '../shared/config';
import {
	SETTING_KEY_COLOR_ON,
	SETTING_KEY_COLOR_OFF,
} from '../shared/settings';

registerSettingsPage(() => (
	<Section title="Colors">
		<Text>On</Text>
		<ColorSelect
			value={defaultConfig.colors.on}
			colors={[
				activeColors.white,
				activeColors.red,
				activeColors.green,
				activeColors.blue,
			].map(color => ({ color }))}
			settingsKey={SETTING_KEY_COLOR_ON}
		/>
		<Text>Off</Text>
		<ColorSelect
			value={defaultConfig.colors.on}
			colors={[
				inactiveColors.none,
				inactiveColors.gray,
				inactiveColors.red,
				inactiveColors.green,
				inactiveColors.blue,
			].map(color => ({ color }))}
			settingsKey={SETTING_KEY_COLOR_OFF}
		/>
	</Section>
));
