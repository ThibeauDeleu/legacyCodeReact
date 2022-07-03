import { useEffect, useState } from 'react';
import { useLocation, useRouteMatch } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import ComponentInterface from '../models/ComponentInterface';
import API from '../utils/api';
import LoadingScreen from './LoadingScreen';
import NoDataScreen from './NoDataScreen';
import ControlDetailScreen from '../components/ControlDetailScreen';
import { groupBy } from '../utils/functions';
import InnerTab from '../components/InnerTab';

export default function ControlScreen() {
	const [groupedControls, setGroupedControls] = useState<any[]>([]);
	const [groups, setGroups] = useState<string[]>([]);
	const [selectedTab, setSelectedTab] = useState<string>('');

	// ! Navigation / userexperience
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isNoData, setIsNoData] = useState<boolean>(false);

	const location = useLocation();
	let { path, url } = useRouteMatch();

	const getControls = async (robotId: string) => {
		try {
			const controlData: ComponentInterface[] = await API.get(
				`robot/components/${robotId}`
			);
			const groupedControlsData = groupBy(controlData, 'group');
			// All groupnames in array so we can use it for navigation
			setGroups(Object.keys(groupedControlsData));
			setGroupedControls(groupedControlsData);
			setIsLoading(false);
			setIsNoData(false);
		} catch (error) {
			setIsLoading(false);
			setIsNoData(true);
			console.error(error);
		}
	};

	useEffect(() => {
		const [robotId] = location.pathname.substring(1).split('/');
		if (robotId != null) {
			getControls(robotId);
		}
	}, []);

	const handleChangeSelectedScreen = (newTab: string) => {
		setSelectedTab(newTab);
	};

	if (isLoading) {
		return <LoadingScreen />;
	} else if (isNoData) {
		return <NoDataScreen />;
	} else {
		return (
			<section className='c-app__data-item--padding'>
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
						<ControlDetailScreen
							controls={groupedControls}
							getInnerTab={handleChangeSelectedScreen}
						/>
					</Route>
					<Redirect
						from={path}
						to={`${path}/${Object.keys(groupedControls)[0]}`}
					/>
				</Switch>
			</section>
		);
	}
}
