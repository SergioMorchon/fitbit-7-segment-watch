import { defaultConfig, colorPalettes } from "../shared/config";
import {
  SETTING_KEY_COLOR_ON,
  SETTING_KEY_COLOR_OFF,
} from "../shared/settings";

const palletes = [
  colorPalettes.white,
  colorPalettes.red,
  colorPalettes.green,
  colorPalettes.blue,
];

registerSettingsPage(({}) => (
  <Section title="Colors">
    <Text>On</Text>
    <ColorSelect
      value={defaultConfig.colors.on}
      colors={palletes.map(({ on }) => ({ color: on }))}
      settingsKey={SETTING_KEY_COLOR_ON}
    />
    <Text>Off</Text>
    <ColorSelect
      value={defaultConfig.colors.on}
      colors={palletes.map(({ off }) => ({ color: off }))}
      settingsKey={SETTING_KEY_COLOR_OFF}
    />
  </Section>
));
