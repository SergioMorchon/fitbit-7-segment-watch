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

const elements = ['h0', 'h1', 'm0', 'm1'].map(id => byId(id));
elements.forEach(element =>
	resize(element, {
		height: 110,
		width: 50,
	}),
);

const padZero = (n: number) => `0${n}`.slice(-2);
const get12hour = (date: Date) => {
	const hours = date.getHours() % 12;
	return hours === 0 ? 12 : hours;
};

const getTimeString = (date: Date) =>
	[
		preferences.clockDisplay === '24h'
			? padZero(date.getHours())
			: ` ${get12hour(date)}`.slice(-2),
		padZero(date.getMinutes()),
	].join('');

let lastTimeString = getTimeString(new Date());

const updateTime = () => {
	for (let i = 0; i < elements.length; i++) {
		print(elements[i], lastTimeString[i], {
			charMap: digits,
			setVisibility: (element, on) => {
				element.style.fill = on ? config.colors.on : config.colors.off;
			},
		});
	}
};

clock.granularity = 'minutes';
clock.addEventListener('tick', ({ date }) => {
	lastTimeString = getTimeString(date);
	updateTime();
});

if (display.aodAvailable && me.permissions.granted('access_aod')) {
	display.aodAllowed = true;
}

inbox.addEventListener('newfile', () => {
	let file: string | undefined;
	while ((file = inbox.nextFile())) {
		config.colors = (readFileSync(file, 'cbor') as Config).colors;
		updateTime();
	}
});
