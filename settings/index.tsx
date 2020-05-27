import { defaultConfig, activeColors, inactiveColors } from '../shared/config';
import {
	SETTING_KEY_COLOR_ON,
	SETTING_KEY_COLOR_OFF,
	SETTING_KEY_SHOW_SECONDS,
	SETTING_KEY_SHOW_DATE,
} from '../shared/settings';
import { gettext } from 'i18n';

registerSettingsPage(() => (
	<Page>
		<Section title={gettext('Visibility')}>
			<Toggle
				label={gettext('Show date')}
				settingsKey={SETTING_KEY_SHOW_DATE}
			/>
			<Toggle
				label={gettext('Show seconds')}
				settingsKey={SETTING_KEY_SHOW_SECONDS}
			/>
		</Section>
		<Section title={gettext('Colors')}>
			<Text>{gettext('On')}</Text>
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
			<Text>{gettext('Off')}</Text>
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
	</Page>
));
