import { settingsStorage } from "settings";
import { outbox } from "file-transfer";
import { encode } from "cbor";

import { Config } from "../shared/config";

settingsStorage.addEventListener("change", () => {
  const colorOn = settingsStorage.getItem("colors-on");
  const colorOff = settingsStorage.getItem("colors-off");
  if (!colorOn || !colorOff) {
    return;
  }

  const config: Config = {
    colors: {
      on: JSON.parse(colorOn),
      off: JSON.parse(colorOff),
    },
  };
  outbox.enqueue("config", encode(config));
});
