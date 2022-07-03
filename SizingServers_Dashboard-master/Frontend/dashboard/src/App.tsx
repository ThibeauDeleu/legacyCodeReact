import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './styles/screen.scss';
import RobotInterface from './models/RobotInterface';
import Dashboard from './components/Dashboard';
import ToggleMode from './components/ToggleMode';
import SideBarTab from './components/SideBarTab';
import SelectRobotScreen from './screens/SelectRobotScreen';
import ProviderActiveMovements from './screens/providers/ProviderActiveMovements';
import API from './utils/api';
import MessageBar from './components/MessageBar';
import './styles/screen.scss';
import AddRobotScreen from './screens/AddRobotScreen';

declare global {
    interface Window {
        _env_: any;
    }
}

console.log(window._env_.API_Url);

function App() {
	const [selectedRobot, setSelectedRobot] = useState<string>('');
	const [isDevMode, setIsDevMode] = useState<boolean>(false);
	const [robots, setRobots] = useState<RobotInterface[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isNoData, setIsNoData] = useState<boolean>(false);

	const handleChangeDevMode = (value: boolean) => {
		setIsDevMode(value);
		localStorage.setItem('@isDevMode', `${value}`);
	};

	useEffect(() => {
		const state: string | null = localStorage.getItem('@isDevMode');
		if (state) {
			setIsDevMode(state === 'true');
		} else {
			localStorage.setItem('@isDevMode', `false`);
			setIsDevMode(false);
		}
	}, []);

	const getRobots = async () => {
		try {
			const tabs: RobotInterface[] = await API.get('robots');
			setIsLoading(false);
			setIsNoData(false);
			setRobots(tabs);
		} catch (e) {
			setIsLoading(false);
			setIsNoData(true);
			console.error(e);
		}
	};

	useEffect(() => {
		getRobots();
	}, []);

	return (
		<ProviderActiveMovements>
			<Router>
				<div className='c-app'>
					<div className='c-app__logo'>
						<Link to='/' className='c-logo'>
							<svg
								className='c-logo-svg'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 73.809 32'
							>
								<g transform='translate(-31.191 -16)'>
									<g transform='translate(31.191 15.99)'>
										<g transform='translate(0 0.01)'>
											<path
												d='M28.184,45.21l-5.2,2.866-5.2-2.866V51.2L20.9,52.991a4.159,4.159,0,0,0,4.164,0L28.184,51.2Z'
												transform='translate(-8.582 -21.55)'
												fill='#fff'
											/>
											<path
												d='M26.825,6.488,16.373.532a3.973,3.973,0,0,0-3.937,0L1.985,6.488A3.882,3.882,0,0,0,0,9.857V21.781a3.882,3.882,0,0,0,1.985,3.368L3.8,26.2V10.516a.836.836,0,0,1,.424-.729.857.857,0,0,1,.851,0l9.326,5.2,9.32-5.2a.857.857,0,0,1,.851,0,.836.836,0,0,1,.424.729V26.187l1.819-1.054a3.883,3.883,0,0,0,1.99-3.353V9.857a3.882,3.882,0,0,0-1.985-3.368Z'
												transform='translate(0 -0.01)'
												fill='#fff'
											/>
										</g>
									</g>
									<text
										transform='translate(86 39)'
										fill='#fff'
										fontSize='16'
										fontFamily='Montserrat-Bold, Montserrat'
										fontWeight='700'
									>
										<tspan x='-18.392' y='0'>
											MCT
										</tspan>
									</text>
								</g>
							</svg>
						</Link>
						<hr className='c-logo-line' />
					</div>
					<aside className='c-app__sidebar'>
						<div>
							<nav className='c-sidebar-nav'>
								{isLoading ? (
									<p className='c-sidebar-nav__feedback c-sidebar-nav__loading u-text__normal--sm'>
										Loading
									</p>
								) : (
									robots.map((robot: RobotInterface) => {
										return (
											<SideBarTab
												key={robot.uuid}
												tabId={robot.uuid}
												robot={robot}
												selectedRobot={selectedRobot}
											/>
										);
									})
								)}
							</nav>
							{isDevMode && (
								<Link
									className='c-button c-button-regular c-add-robot-btn o-button-reset'
									to={'/addrobot'}
								>
									<svg
										className='c-button-regular__icon'
										id='add_circle_black_24dp'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
									>
										<path
											id='Path_43'
											data-name='Path 43'
											d='M0,0H24V24H0Z'
											fill='none'
										/>
										<path
											id='Path_44'
											data-name='Path 44'
											d='M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm5,11H13v4H11V13H7V11h4V7h2v4h4Z'
										/>
									</svg>
									Add
								</Link>
							)}
						</div>

						<ToggleMode
							isDevMode={isDevMode}
							onChangeDevMode={handleChangeDevMode}
						/>
					</aside>
					<MessageBar
						message='Could not get the robots.'
						type='error'
						showMessageBar={isNoData}
						className='c-message-bar__no-header'
						onChangeShowMessage={(value: boolean) => setIsNoData(value)}
					/>
					<Switch>
						<Route path={`/addrobot`}>
							<AddRobotScreen />
						</Route>
						<Route path={`/:robotId`}>
							<Dashboard
								getRobotId={(uuid: string) => {
									setSelectedRobot(uuid);
								}}
							/>
						</Route>

						<Route path='/'>
							<SelectRobotScreen
								resetRobotId={() => {
									setSelectedRobot('');
								}}
							/>
						</Route>
					</Switch>
				</div>
			</Router>
		</ProviderActiveMovements>
	);
}

export default App;
