import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import ConnectionCard from '../components/ConnectionCard';
import LogsCard from '../components/LogsCard';
import HeatLogsCard from '../components/HeatLogsCard';
import DetailLogs from '../components/DetailLogs';
import LoadingScreen from './LoadingScreen';
import NoDataScreen from './NoDataScreen';
import ComponentLogInterface from '../models/ComponentLogInterface';
import API from '../utils/api';
import MessageBar from '../components/MessageBar';
import { groupByNested } from '../utils/functions';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import InnerTab from '../components/InnerTab';
import StatusDetailScreen from '../components/StatusDetailScreen';
import MovementLogInterface from '../models/MovementLogInterface';
import RobotInterface from '../models/RobotInterface';

export default function StatusScreen() {
	const [componentLogs, setComponentLogs] = useState<ComponentLogInterface[]>(
		[]
	);
	const [movementLogs, setMovementLogs] = useState<MovementLogInterface[]>([]);
	const [robotData, setRobotData] = useState<RobotInterface>({
		uuid: '1',
		name: 'Loading',
		description: 'Loading',
		picture: 'eliot-profile.svg',
		ip: 'Loading',
		extra_info: {},
	});
	const [groupedLogs, setGroupedLogs] = useState<any[]>([]);
	const [groups, setGroups] = useState<string[]>([]);
	const [selectedTab, setSelectedTab] = useState<string>('');

	const [errorMessage, setErrorMessage] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isNoData, setIsNoData] = useState<boolean>(false);
	const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

	const location = useLocation();

	let { path, url } = useRouteMatch();

	useEffect(() => {
		const [robotId] = location.pathname.substring(1).split('/');
		if (robotId != null) {
			getLogs(robotId);
		}
	}, []);

	const getLogs = async (robotId: string) => {
		try {
			let componentlogsData: ComponentLogInterface[] = await API.get(
				`log/component/robot/${robotId}`
			);

			let movementlogsData: MovementLogInterface[] = await API.get(
				`log/movement/robot/${robotId}`
			);

			let robotGegData: RobotInterface = await API.get(`robot/id/${robotId}`);

			const groupedControlsData = groupByNested(
				componentlogsData,
				'component.group'
			);
			setGroups(Object.keys(groupedControlsData));
			setGroupedLogs(groupedControlsData);

			setComponentLogs(componentlogsData);
			setMovementLogs(movementlogsData);
			setRobotData(robotGegData);

			setIsLoading(false);
			setIsNoData(false);
		} catch (error) {
			setIsLoading(false);
			setIsNoData(true);
			console.error(error);
		}
	};

	if (isLoading) {
		return <LoadingScreen />;
	} else if (isNoData) {
		return <NoDataScreen />;
	} else {
		return (
			<section className='c-statusScreen-container c-app__data-item--padding'>
				<MessageBar
					message={errorMessage}
					type='error'
					showMessageBar={showErrorMessage}
					className='c-message-bar'
					onChangeShowMessage={(value: boolean) => setShowErrorMessage(value)}
				/>
				<div className='c-statusScreen-container__info'>
					<ConnectionCard robotGeg={robotData} />

					<nav className='c-inner-nav'>
						{groups.map((group: string) => {
							return (
								<InnerTab
									key={group}
									tabId={group}
									name={group}
									url={url}
									selectedTab={selectedTab}
								/>
							);
						})}
					</nav>
					<Switch>
						<Route path={`${path}/:groupname`}>
							<StatusDetailScreen
								logs={groupedLogs}
								getInnerTab={(name: string) => {
									setSelectedTab(name);
								}}
							/>
						</Route>
						<Redirect
							from={path}
							to={`${path}/${Object.keys(groupedLogs)[0]}`}
						/>
					</Switch>
				</div>

				<div className='c-statusScreen-container__logs'>
					<LogsCard logs={movementLogs} />
				</div>
			</section>
		);
	}
}
