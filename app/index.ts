import { byId } from "fitbit-widgets/dist/document";
import { print, resize } from "fitbit-widgets/dist/7-segment-display";
import digits from "fitbit-widgets/dist/7-segment-display/digits";
import clock from "clock";

const elements = ["h0", "h1", "m0", "m1"].map((id) => byId(id));
elements.forEach((element) =>
  resize(element, {
    height: 80,
    width: 40,
  })
);

const padZero = (n: number) => `0${n}`.slice(-2);

clock.granularity = "minutes";
clock.addEventListener("tick", ({ date }) => {
  const timeString = [date.getHours(), date.getMinutes()].map(padZero).join("");
  for (let i = 0; i < elements.length; i++) {
    print(elements[i], timeString[i], {
      charMap: digits,
      setVisibility: (element, on) => {
        element.class = on ? "on" : "off";
      },
    });
  }
});
