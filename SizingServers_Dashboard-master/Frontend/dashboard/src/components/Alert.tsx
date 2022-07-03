import dayjs from 'dayjs';
import { alertTypeIcons } from '../utils/alerts';
import { oneToTwoNumberNotation } from '../utils/functions';

export default function Alert({
	level,
	message,
	time,
}: {
	level: string;
	message: string;
	time: string;
}) {
	return (
		<div className={`c-alert ${level}`}>
			<div className='c-alert__data'>
				{/* @ts-ignore */}
				{alertTypeIcons[level]}
				<p className='c-alert__message'>{message}</p>
			</div>
			<p className='c-alert__time'>
				{oneToTwoNumberNotation(dayjs(time).hour())}:{oneToTwoNumberNotation(dayjs(time).minute())}
			</p>
		</div>
	);
}
