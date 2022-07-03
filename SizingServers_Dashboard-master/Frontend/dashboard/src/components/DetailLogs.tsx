import { ChangeEvent, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import ComponentLogInterface from '../models/ComponentLogInterface';
import DetailLogsCard from './DetailLogsCard';

export default function DetailLogs({
	logs,
}: {
	logs: ComponentLogInterface[];
}) {
	// ! Filter options
	const [selectedTime, setSelectedTime] = useState<any>(dayjs());
	const [selectedLevel, setSelectedLevel] = useState<string>('All');
	// ! Data to render
	const [dataLogs, setDataLogs] = useState<ComponentLogInterface[]>([]);

	const filter = (
		date: Dayjs,
		level: string,
		logsArr: ComponentLogInterface[]
	) => {
		let dataContainer: ComponentLogInterface[] = [];
		if (level === 'All') {
			dataContainer = logsArr.filter(
				(t: ComponentLogInterface) =>
					dayjs(t.start_time).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
			);
		} else {
			dataContainer = logsArr.filter(
				(t: ComponentLogInterface) =>
					dayjs(t.start_time).format('YYYY-MM-DD') ===
						date.format('YYYY-MM-DD') &&
					t.level.toLowerCase() === level.toLowerCase()
			);
		}
		return dataContainer;
	};

	useEffect(() => {
		setDataLogs(filter(selectedTime, selectedLevel, logs));
	}, [logs, selectedTime, selectedLevel]);

	return (
		<section className='c-logs-detail-container'>
			<h1 className='c-logs-detail-title'>Logs</h1>
			<div className='c-logs-detail-filter__container'>
				<input
					className='c-logs-detail-filter-datepicker'
					type='date'
					value={selectedTime.format('YYYY-MM-DD')}
					onChange={(event: ChangeEvent<HTMLInputElement>) => {
						setSelectedTime(dayjs(event.target.value));
					}}
				/>
				<span className='c-custom-select'>
					<select
						name='movement'
						id='movement'
						value={selectedLevel}
						onChange={(event: ChangeEvent<HTMLSelectElement>) => {
							setSelectedLevel(event.target.value);
						}}
						className='c-form-dropdown c-custom-select__input'
					>
						<option value='All'>All</option>
						<option value='Info'>Info</option>
						<option value='Warning'>Warning</option>
						<option value='Error'>Error</option>
						<option value='Debug'>Debug</option>
						<option value='Critical'>Critical</option>
					</select>
					<svg
						className='c-custom-select__symbol'
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
					>
						<path
							id='Path_55'
							data-name='Path 55'
							d='M0,0H24V24H0Z'
							fill='none'
						/>
						<path
							id='Path_56'
							data-name='Path 56'
							d='M16.59,8.59,12,13.17,7.41,8.59,6,10l6,6,6-6Z'
						/>
					</svg>
				</span>
				{/* <select
					className='c-logs-detail-filter-select'
					value={selectedLevel}
					onChange={(event: ChangeEvent<HTMLSelectElement>) => {
						setSelectedLevel(event.target.value);
					}}
				>
					<option value='All'>All</option>
					<option value='Info'>Info</option>
					<option value='Warning'>Warning</option>
					<option value='Error'>Error</option>
					<option value='Debug'>Debug</option>
					<option value='Critical'>Critical</option>
				</select> */}
			</div>

			<article className='c-logs-detail-table'>
				<header className='c-logs-detail-table__header'>
					<p className='c-logs-detail-table__header-title'>Description</p>
					<p className='c-logs-detail-table__header-title'>Start</p>
					<p className='c-logs-detail-table__header-title'>Stop</p>
				</header>

				<article className='c-logs-detail-table__data-container'>
					{dataLogs.length > 0 ? (
						dataLogs.map((a: ComponentLogInterface) => (
							<DetailLogsCard key={a.uuid} log={a} />
						))
					) : (
						<p className='c-logs-detail-table__not-found'>
							No logs for this selection.
						</p>
					)}
				</article>
			</article>
		</section>
	);
}
