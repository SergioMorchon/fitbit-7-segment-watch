import { byId } from 'fitbit-widgets/dist/document';
import segmentDisplay from 'fitbit-widgets/dist/7-segment-display';
import digits from 'fitbit-widgets/dist/7-segment-display/digits';
import clock from 'clock';
import { inbox } from 'file-transfer';
import { config } from './config';
import { readFileSync } from 'fs';
import { Config } from '../shared/config';
import { display } from 'display';
import { me } from 'appbit';
import { preferences } from 'user-settings';

import type { SegmentDisplay } from 'fitbit-widgets/dist/7-segment-display';

const isAODEnabled = () => display.aodActive && display.on;

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

const updateSegment = (segment: GraphicsElement, on: boolean) => {
	segment.style.fill = on ? config.colors.on : config.colors.off;
};

const showDate = (): boolean => config.showDate && !isAODEnabled();
const showSeconds = (): boolean => config.showSeconds && !isAODEnabled();

const dateDisplays = ['d0', 'd1', 'd2', 'd3'].map(id =>
	segmentDisplay(byId(id), {
		charMap: digits,
		height: 50,
		width: 25,
		visible: showDate(),
		value: '',
		updateSegment,
	}),
);
const timeDisplays = ['h0', 'h1', 'm0', 'm1'].map(id =>
	segmentDisplay(byId(id), {
		charMap: digits,
		height: 110,
		width: 50,
		visible: true,
		value: '',
		updateSegment,
	}),
);
const secondsDisplays = ['s0', 's1'].map(id =>
	segmentDisplay(byId(id), {
		charMap: digits,
		height: 50,
		width: 25,
		value: '',
		visible: showSeconds(),
		updateSegment,
	}),
);

const getUpdater = (displays: readonly SegmentDisplay[], ref: Ref) => () => {
	for (let i = 0; i < displays.length; i++) {
		displays[i].value = ref.current[i];
	}
};
const updateSeconds = getUpdater(secondsDisplays, secondsRef);
const updateTime = getUpdater(timeDisplays, timeRef);
const updateDate = getUpdater(dateDisplays, dateRef);

const updateClockGranularity = () => {
	clock.granularity = isAODEnabled() ? 'minutes' : 'seconds';
};
updateClockGranularity();

const updateVisibility = () => {
	for (const dateDisplay of dateDisplays) {
		dateDisplay.visible = showDate();
	}

	for (const secondsDisplay of secondsDisplays) {
		secondsDisplay.visible = showSeconds();
	}
};

if (display.aodAvailable && me.permissions.granted('access_aod')) {
	display.aodAllowed = true;
}

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

display.addEventListener('change', () => {
	updateClockGranularity();
	updateVisibility();
});

inbox.addEventListener('newfile', () => {
	let file: string | undefined;
	while ((file = inbox.nextFile())) {
		const newConfig = readFileSync(file, 'cbor') as Config;
		config.colors = newConfig.colors;
		config.showSeconds = newConfig.showSeconds;
		config.showDate = newConfig.showDate;
		config.dateFormat = newConfig.dateFormat;

		updateSeconds();
		updateTime();
		updateDate();
		updateVisibility();
	}
});
