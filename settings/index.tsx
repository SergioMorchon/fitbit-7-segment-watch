import {
	defaultConfig,
	activeColors,
	inactiveColors,
	Config,
} from '../shared/config';
import {
	SETTING_KEY_COLOR_ON,
	SETTING_KEY_COLOR_OFF,
	SETTING_KEY_SHOW_SECONDS,
	SETTING_KEY_SHOW_DATE,
	SETTING_KEY_DATE_FORMAT,
} from '../shared/settings';
import { gettext } from 'i18n';

registerSettingsPage(
	({ settings: { [SETTING_KEY_SHOW_DATE]: rawShowDate } }) => (
		<Page>
			<Section title={gettext('Date')}>
				<Toggle label={gettext('Show')} settingsKey={SETTING_KEY_SHOW_DATE} />
				{rawShowDate && JSON.parse(rawShowDate) && (
					<Select<{ name: string; value: Config['dateFormat'] }>
						label={gettext('Format')}
						options={[
							{ name: gettext('mmdd'), value: 'mmdd' },
							{ name: gettext('ddmm'), value: 'ddmm' },
						]}
						settingsKey={SETTING_KEY_DATE_FORMAT}
					/>
				)}
			</Section>
			<Section title={gettext('Seconds')}>
				<Toggle
					label={gettext('Show')}
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
					].map((color) => ({ color }))}
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
					].map((color) => ({ color }))}
					settingsKey={SETTING_KEY_COLOR_OFF}
				/>
			</Section>
		</Page>
	),
);
