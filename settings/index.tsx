import { defaultConfig, colorPalettes } from "../shared/config";

const palletes = [
  colorPalettes.red,
  colorPalettes.green,
  colorPalettes.blue,
  colorPalettes.white,
];

registerSettingsPage(({}) => (
  <Section title="Colors">
    <Text>On</Text>
    <ColorSelect
      value={defaultConfig.colors.on}
      colors={palletes.map(({ on }) => ({ color: on }))}
      settingsKey="colors-on"
    />
    <Text>Off</Text>
    <ColorSelect
      value={defaultConfig.colors.on}
      colors={palletes.map(({ off }) => ({ color: off }))}
      settingsKey="colors-off"
    />
  </Section>
));
