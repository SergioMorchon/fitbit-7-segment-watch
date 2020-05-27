import { byId } from 'fitbit-widgets/dist/document';
import { print, resize } from 'fitbit-widgets/dist/7-segment-display';
import digits from 'fitbit-widgets/dist/7-segment-display/digits';
import clock from 'clock';
import { inbox } from 'file-transfer';
import { config } from './config';
import { readFileSync } from 'fs';
import { Config } from '../shared/config';
import { display } from 'display';
import { me } from 'appbit';
import { preferences } from 'user-settings';

const dayOfMonthElements = ['d0', 'd1'].map(id => byId(id));
const monthElements = ['d2', 'd3'].map(id => byId(id));
const hoursElements = ['h0', 'h1'].map(id => byId(id));
const minutesElements = ['m0', 'm1'].map(id => byId(id));
const secondsElements = ['s0', 's1'].map(id => byId(id));

[...hoursElements, ...minutesElements].forEach(element =>
	resize(element, {
		height: 110,
		width: 50,
	}),
);
[...monthElements, ...dayOfMonthElements, ...secondsElements].forEach(element =>
	resize(element, {
		height: 50,
		width: 25,
	}),
);

const padZero = (n: number) => `0${n}`.slice(-2);
const get12hour = (date: Date) => {
	const hours = date.getHours() % 12;
	return hours === 0 ? 12 : hours;
};

const getSecondsString = (date: Date) => padZero(date.getSeconds());
const getMinutesString = (date: Date) => padZero(date.getMinutes());
const getHoursString = (date: Date) =>
	preferences.clockDisplay === '24h'
		? padZero(date.getHours())
		: ` ${get12hour(date)}`.slice(-2);
const getDayOfMonthString = (date: Date) => padZero(date.getDate());
const getMonthString = (date: Date) => padZero(date.getMonth() + 1);

type Ref = {
	current: string;
};

const secondsRef: Ref = {
	current: '',
};
const minutesRef: Ref = {
	current: '',
};
const hoursRef: Ref = {
	current: '',
};
const dayOfMonthRef: Ref = {
	current: '',
};
const monthRef: Ref = {
	current: '',
};

const defaultSetVisibility = (element: GraphicsElement, on: boolean) => {
	element.style.fill = on ? config.colors.on : config.colors.off;
};

const getUpdater = (
	elements: Element[],
	ref: Ref,
	setVisibility = defaultSetVisibility,
) => () => {
	for (let i = 0; i < elements.length; i++) {
		print(elements[i], ref.current[i], {
			charMap: digits,
			setVisibility,
		});
	}
};

const updateSeconds = getUpdater(secondsElements, secondsRef, (element, on) => {
	element.style.fill =
		config.showSeconds && on ? config.colors.on : config.colors.off;
});
const updateMinutes = getUpdater(minutesElements, minutesRef);
const updateHours = getUpdater(hoursElements, hoursRef);

const setDateElementVisibility = (element: GraphicsElement, on: boolean) => {
	element.style.fill =
		config.showDate && on ? config.colors.on : config.colors.off;
};
const updateDayOfMonth = getUpdater(
	dayOfMonthElements,
	dayOfMonthRef,
	setDateElementVisibility,
);
const updateMonth = getUpdater(
	monthElements,
	monthRef,
	setDateElementVisibility,
);

clock.granularity = 'seconds';
clock.addEventListener('tick', ({ date }) => {
	const newSeconds = getSecondsString(date);
	if (newSeconds !== secondsRef.current) {
		secondsRef.current = newSeconds;
		updateSeconds();
	}

	const newMinutes = getMinutesString(date);
	if (newMinutes !== minutesRef.current) {
		minutesRef.current = newMinutes;
		updateMinutes();
	}

	const newHours = getHoursString(date);
	if (newHours !== hoursRef.current) {
		hoursRef.current = newHours;
		updateHours();
	}

	const newDayOfMonth = getDayOfMonthString(date);
	if (newDayOfMonth !== dayOfMonthRef.current) {
		dayOfMonthRef.current = newDayOfMonth;
		updateDayOfMonth();
	}

	const newMonth = getMonthString(date);
	if (newMonth !== monthRef.current) {
		monthRef.current = newMonth;
		updateMonth();
	}
});

if (display.aodAvailable && me.permissions.granted('access_aod')) {
	display.aodAllowed = true;
}

inbox.addEventListener('newfile', () => {
	let file: string | undefined;
	while ((file = inbox.nextFile())) {
		const newConfig = readFileSync(file, 'cbor') as Config;
		config.colors = newConfig.colors;
		config.showSeconds = newConfig.showSeconds;
		config.showDate = newConfig.showDate;
		updateSeconds();
		updateMinutes();
		updateHours();
		updateDayOfMonth();
		updateMonth();
	}
});
