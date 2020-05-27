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

const isAODEnabled = () => display.aodActive && display.on;

const dateElements = ['d0', 'd1', 'd2', 'd3'].map(id => byId(id));
const timeElements = ['h0', 'h1', 'm0', 'm1'].map(id => byId(id));
const secondsElements = ['s0', 's1'].map(id => byId(id));

timeElements.forEach(element =>
	resize(element, {
		height: 110,
		width: 50,
	}),
);
[...dateElements, ...secondsElements].forEach(element =>
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
const getTimeString = (date: Date) =>
	[
		preferences.clockDisplay === '24h'
			? padZero(date.getHours())
			: ` ${get12hour(date)}`.slice(-2),
		padZero(date.getMinutes()),
	].join('');
const getDateString = (date: Date) => {
	const mm = padZero(date.getMonth() + 1);
	const dd = padZero(date.getDate());
	return (config.dateFormat === 'mmdd' ? [mm, dd] : [dd, mm]).join('');
};

type Ref = {
	current: string;
};

const secondsRef: Ref = {
	current: '',
};
const timeRef: Ref = {
	current: '',
};
const dateRef: Ref = {
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
	if (config.showSeconds && !isAODEnabled()) {
		element.style.display = 'inline';
		element.style.fill = on ? config.colors.on : config.colors.off;
	} else {
		element.style.display = 'none';
	}
});
const updateTime = getUpdater(timeElements, timeRef);
const updateDate = getUpdater(
	dateElements,
	dateRef,
	(element: GraphicsElement, on: boolean) => {
		if (config.showDate && !isAODEnabled()) {
			element.style.display = 'inline';
			element.style.fill = on ? config.colors.on : config.colors.off;
		} else {
			element.style.display = 'none';
		}
	},
);

const updateClockGranularity = () => {
	clock.granularity = isAODEnabled() ? 'minutes' : 'seconds';
};
updateClockGranularity();
clock.addEventListener('tick', ({ date }) => {
	const newSeconds = getSecondsString(date);
	if (newSeconds !== secondsRef.current) {
		secondsRef.current = newSeconds;
		updateSeconds();
	}

	const newTime = getTimeString(date);
	if (newTime !== timeRef.current) {
		timeRef.current = newTime;
		updateTime();
	}

	const newDate = getDateString(date);
	if (newDate !== dateRef.current) {
		dateRef.current = newDate;
		updateDate();
	}
});

const update = () => {
	updateSeconds();
	updateTime();
	updateDate();
};

if (display.aodAvailable && me.permissions.granted('access_aod')) {
	display.aodAllowed = true;
	display.addEventListener('change', () => {
		updateClockGranularity();
		update();
	});
}

inbox.addEventListener('newfile', () => {
	let file: string | undefined;
	while ((file = inbox.nextFile())) {
		const newConfig = readFileSync(file, 'cbor') as Config;
		config.colors = newConfig.colors;
		config.showSeconds = newConfig.showSeconds;
		config.showDate = newConfig.showDate;
		config.dateFormat = newConfig.dateFormat;
		update();
	}
});
