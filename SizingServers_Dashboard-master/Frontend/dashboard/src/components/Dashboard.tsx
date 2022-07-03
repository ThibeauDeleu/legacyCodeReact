import { useEffect, useState } from 'react';
import {
	Link,
	Redirect,
	Route,
	Switch,
	useLocation,
	useRouteMatch,
} from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import ControlScreen from '../screens/ControlScreen';
import SequenceScreen from '../screens/SequenceScreen';
import DemoScreen from '../screens/DemoScreen';
import StatusScreen from '../screens/StatusScreen';
import AboutScreen from '../screens/AboutScreen';
import EditMovementScreen from '../screens/EditMovementScreen';
import EditRobotScreen from '../screens/EditRobotScreen';
import TopBarTab from './TopBarTab';
import Alert from './Alert';
import AddActionScreen from '../screens/AddActionScreen';
import AddRobotScreen from '../screens/AddRobotScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import RobotInterface from '../models/RobotInterface';
import API from '../utils/api';
import MessageBar from './MessageBar';
import MQTT from '../store/mqttConnect';
import ComponentLogInterface from '../models/ComponentLogInterface';
import { getUnique } from '../utils/functions';

export default function Dashboard({ getRobotId }: { getRobotId: Function }) {
	// ! Robot connection
	const [selectedScreen, setSelectedScreen] = useState<string>('');
	const [isConnected, setIsConnected] = useState<boolean>(false);

	// ! Alerts
	const [alerts, setAlerts] = useState<ComponentLogInterface[]>([]);
	const [oldAlerts, setOldAlerts] = useState<ComponentLogInterface[]>([]);
	const [alertsSeen, setAlertsSeen] = useState<boolean>(false);
	const [alertsChecked, setAlertsChecked] = useState<boolean>(false);

	// ! Connection
	const [connectionChecked, setConnectionChecked] = useState<boolean>(false);
	const [lastConnectionMessage, setLastConnectionMessage] = useState<Dayjs>(
		dayjs()
	);

	// ! Robot
	const [robot, setRobot] = useState<RobotInterface | undefined>(undefined);
	const [robotId, setRobotId] = useState<string>('');

	// ! Error handling
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

	let { path, url } = useRouteMatch();
	const location = useLocation();

	useEffect(() => {
		const check = setInterval(function () {
			const prevUnix = lastConnectionMessage.unix();
			const nowUnix = dayjs().subtract(2, 'seconds').unix();
			if (prevUnix < nowUnix) {
				setIsConnected(false);
			} else {
				setIsConnected(true);
			}
		}, 5000);
		return () => clearInterval(check);
	}, []);

	const getRobot = async (robotId: string) => {
		try {
			const robotdata: RobotInterface = await API.get(`robot/id/${robotId}`);
			setRobot(robotdata);
			setShowErrorMessage(false);
		} catch (error) {
			setShowErrorMessage(true);
			setErrorMessage(`Could not get robot from API for subscription on MQTT`);
		}
	};

	function mqttRecieve(topic: string, message: string) {
		// parse to object
		let data = JSON.parse(message.toString());
		// check if connected
		if (topic.split('/')[0] === 'robot') {
			setIsConnected(true);
			setLastConnectionMessage(dayjs());
		} else if (topic.split('/')[0] === 'logs') {
			setAlerts((prev) => {
				return getUnique([...prev, data], 'uuid');
			});
			setAlertsSeen(false);
		}
	}

	useEffect(() => {
		if (robot) {
			const topics: string[] = [
				`robot/${robot!.name.toLowerCase()}/heartbeat`,
				`logs/${robot!.name.toLowerCase()}`,
			];
			MQTT.subscribe(topics);
			MQTT.client.on('message', mqttRecieve);

			// ! if we go away, unsubscribe
			return () => {
				MQTT.unsubscribe(topics);
			};
		}
	}, [robot]);

	const handleChangeSelectedScreen = (newTab: string) => {
		setSelectedScreen(newTab);
	};

	useEffect(() => {
		if (robotId !== '') getRobot(robotId);
	}, [robotId]);

	// ! Check on change location

	const cleanUp = () => {
		setAlerts([]);
		setOldAlerts([]);
	};

	useEffect(() => {
		const [robotIdData, topbarTab] = location.pathname.substring(1).split('/');
		if (robotId !== robotIdData) {
			cleanUp();
			setRobotId(robotIdData);
			getRobotId(robotIdData);
		}
		setSelectedScreen(topbarTab);
	}, [location]);

	const seenAlerts = () => {
		setAlertsSeen(true);
		setOldAlerts(alerts);
		setAlertsChecked(!alertsChecked);
		setConnectionChecked(false);
	};

	return (
		<div className='c-app__main'>
			<MessageBar
				message={errorMessage}
				type='error'
				showMessageBar={showErrorMessage}
				className='c-message-bar'
				onChangeShowMessage={(value: boolean) => setShowErrorMessage(value)}
			/>
			<header className='c-app__topbar'>
				<nav className='c-topbar-nav'>
					<TopBarTab
						tabId='controls'
						name='Controls'
						url={url}
						robot={robot}
						selectedScreen={selectedScreen}
						onChangeSelectedScreen={handleChangeSelectedScreen}
					/>
					<TopBarTab
						tabId='sequences'
						name='Sequences'
						url={url}
						robot={robot}
						selectedScreen={selectedScreen}
						onChangeSelectedScreen={handleChangeSelectedScreen}
					/>
					<TopBarTab
						tabId='demos'
						name='Demos'
						url={url}
						robot={robot}
						selectedScreen={selectedScreen}
						onChangeSelectedScreen={handleChangeSelectedScreen}
					/>
					<TopBarTab
						tabId='chatbot'
						name='Chatbot'
						url={url}
						selectedScreen={selectedScreen}
						onChangeSelectedScreen={handleChangeSelectedScreen}
					/>
					<hr className='c-topbar-nav__split' />
					<TopBarTab
						tabId='status'
						name='Status'
						url={url}
						selectedScreen={selectedScreen}
						onChangeSelectedScreen={handleChangeSelectedScreen}
					/>
					<TopBarTab
						tabId='about'
						name='About'
						url={url}
						selectedScreen={selectedScreen}
						onChangeSelectedScreen={handleChangeSelectedScreen}
					/>
				</nav>
				<nav className='c-topbar-action'>
					<div className='c-topbar-button c-topbar-alerts'>
						<input
							type='checkbox'
							id='alerts'
							className='c-topbar-button__input c-topbar-alerts__input o-hide-accessible'
							checked={alertsChecked}
							onChange={() => {}}
						></input>
						<label
							onClick={() => {
								!alertsChecked
									? seenAlerts()
									: setAlertsChecked(!alertsChecked);
								setConnectionChecked(false);
							}}
							htmlFor='alerts'
							className={
								'c-topbar-button__label c-topbar-alerts__label ' +
								(alerts.length - oldAlerts.length > 0
									? 'c-topbar-alerts__label-pulse'
									: '')
							}
						>
							<svg
								className='c-topbar-button__icon c-topbar-alerts__icon'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
							>
								<path d='M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z' />
							</svg>
						</label>
						{alerts.length > 0 && !alertsSeen && !alertsChecked && (
							<span className='c-topbar-alerts__count'>
								{alerts.length - oldAlerts.length > 0 &&
									alerts.length - oldAlerts.length}
							</span>
						)}
						<label
							htmlFor='alerts'
							className='c-topbar-alerts__detail-overlay'
							onClick={() => setAlertsChecked(!alertsChecked)}
						></label>
						<div className='c-topbar-button__detail c-topbar-alerts__detail'>
							<p className='u-text__normal--bold u-mb-sm c-topbar-alerts__title'>
								Alerts
							</p>
							{alerts.slice(-5).map((a: ComponentLogInterface) => {
								return (
									<Alert
										key={uuidv4()}
										level={a.level.toLowerCase()}
										message={a.description}
										time={a.start_time}
									/>
								);
							})}
							<Link
								to={`${url}/status`}
								onClick={() => {
									setSelectedScreen('status');
									setAlertsChecked(false);
								}}
								className='o-button-reset c-alert__button'
							>
								Show more
							</Link>
						</div>
					</div>
					<div
						className={`c-topbar-button c-topbar-connection ${
							isConnected && 'is-connected'
						}`}
					>
						<input
							type='checkbox'
							id='connection'
							className='c-topbar-button__input c-topbar-connection__input o-hide-accessible'
							onChange={() => {
								setConnectionChecked(!connectionChecked);
								setAlertsChecked(false);
							}}
							checked={connectionChecked && !alertsChecked}
						/>
						<label
							htmlFor='connection'
							className='c-topbar-button__label c-topbar-connection__label is-not-connected'
						>
							<svg
								className='c-topbar-button__icon c-topbar-connection__icon'
								xmlns='http://www.w3.org/2000/svg'
								enableBackground='new 0 0 24 24'
								viewBox='0 0 24 24'
							>
								<rect fill='none' height='24' width='24' />
								<path d='M7.76,16.24C6.67,15.16,6,13.66,6,12s0.67-3.16,1.76-4.24l1.42,1.42C8.45,9.9,8,10.9,8,12c0,1.1,0.45,2.1,1.17,2.83 L7.76,16.24z M16.24,16.24C17.33,15.16,18,13.66,18,12s-0.67-3.16-1.76-4.24l-1.42,1.42C15.55,9.9,16,10.9,16,12 c0,1.1-0.45,2.1-1.17,2.83L16.24,16.24z M12,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,10,12,10z M20,12 c0,2.21-0.9,4.21-2.35,5.65l1.42,1.42C20.88,17.26,22,14.76,22,12s-1.12-5.26-2.93-7.07l-1.42,1.42C19.1,7.79,20,9.79,20,12z M6.35,6.35L4.93,4.93C3.12,6.74,2,9.24,2,12s1.12,5.26,2.93,7.07l1.42-1.42C4.9,16.21,4,14.21,4,12S4.9,7.79,6.35,6.35z' />
							</svg>
						</label>
						<label
							htmlFor='connection'
							className='c-topbar-connection__detail-overlay'
						></label>
						<div className='c-topbar-button__detail c-topbar-connection__detail'>
							<p className='u-text__normal--bold'>
								MQTT
								<span className='c-topbar-connection__state'>{`${
									isConnected ? 'connected' : 'not connected'
								}`}</span>
							</p>
						</div>
					</div>
				</nav>
			</header>
			<main className='c-app__data'>
				<Switch>
					<Route path={`${path}/controls`}>
						<ControlScreen />
					</Route>
					<Route path={`${path}/sequences`}>
						<SequenceScreen />
					</Route>
					<Route path={`${path}/demos`}>
						<DemoScreen />
					</Route>
					<Route path={`${path}/status`}>
						<StatusScreen />
					</Route>
					<Route path={`${path}/about`}>
						<AboutScreen />
					</Route>
					<Route path={`${path}/chatbot`}>
						<ChatbotScreen />
					</Route>
					<Route path={`${path}/addaction/:Atype`}>
						<AddActionScreen />
					</Route>
					<Route path={`${path}/editmovement/:movementId`}>
						<EditMovementScreen />
					</Route>
					<Route path={`${path}/editrobot`}>
						<EditRobotScreen />
					</Route>
					<Redirect from={path} to={`${path}/controls`} />
				</Switch>
			</main>
		</div>
	);
}
