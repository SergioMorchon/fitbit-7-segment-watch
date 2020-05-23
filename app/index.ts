import { byId } from "fitbit-widgets/dist/document";
import { print, resize, DIGITS } from "fitbit-widgets/dist/7-segment-display";
import clock from "clock";

const elements = ["h0", "h1", "m0", "m1"].map((id) => byId(id));
elements.forEach((element) =>
  resize(element, {
    height: 80,
    width: 40,
  })
);

const padZero = (n: number) => `0${n}`.slice(-2);

const updateTime = () => {
  const now = new Date();
  const timeString = [now.getHours(), now.getMinutes()].map(padZero).join("");
  for (let i = 0; i < elements.length; i++) {
    print(elements[i], timeString[i], {
      charMap: DIGITS,
      classNames: {
        on: "on",
        off: "off",
      },
    });
  }
};

clock.granularity = "minutes";
clock.addEventListener("tick", updateTime);
