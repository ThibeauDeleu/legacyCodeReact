import dayjs, { Dayjs } from 'dayjs';
import ComponentLogInterface from '../models/ComponentLogInterface';
import { alertTypeIcons } from '../utils/alerts';
import { checkIfDateIsToday } from '../utils/functions';

export default function DetailLogsCard({
	log,
}: {
	log: ComponentLogInterface;
}) {
	const checkIfTodayForFormat = (date: Dayjs) => {
		if (checkIfDateIsToday(date)) {
			return date.format('HH:mm:ss');
		}
		return date.format('YYYY-MM-DD HH:mm:ss');
	};

	return (
		<div className='c-logs-detail-table__data'>
			<p
				className={`c-logs-detail-table__data-item ${log.level.toLowerCase()}`}
			>
				{/* @ts-ignore */}
				{alertTypeIcons[log.level.toLocaleLowerCase()]}

				{log.description}
			</p>
			<p className='c-logs-detail-table__data-text'>
				{checkIfTodayForFormat(dayjs(log.start_time))}
			</p>
			<p className='c-logs-detail-table__data-text'>
				{checkIfTodayForFormat(dayjs(log.end_time))}
			</p>
		</div>
	);
}
