import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RobotInterface from '../models/RobotInterface';
import { activeMovementsContext } from '../store/activeMovements';

export default function TopBarTab({
	tabId,
	name,
	url,
	selectedScreen,
	onChangeSelectedScreen,
	robot,
}: {
	tabId: string;
	name: string;
	url: string;
	selectedScreen: string;
	onChangeSelectedScreen: Function;
	robot?: RobotInterface;
}) {
	const [tabHasActiveMovement, setTabHasActiveMovement] =
		useState<boolean>(false);

	const { activeMovements } = useContext(
		activeMovementsContext
	);

	const checkIfTabHasActiveMovements = () => {
		if (robot!.name in activeMovements) {
			if (
				//@ts-ignore
				name.toLowerCase().slice(0, -1) in activeMovements[robot!.name]
			) {
				setTabHasActiveMovement(true);
			}
		} else {
			setTabHasActiveMovement(false);
		}
	};

	useEffect(() => {
		if (robot) {
			checkIfTabHasActiveMovements();
		}
	}, [activeMovements, robot]);

	return (
		<Link
			to={`${url}/${tabId}`}
			onClick={() => onChangeSelectedScreen(tabId)}
			className={`c-topbar-nav__item ${
				selectedScreen === tabId && 'is-active'
			}`}
		>
			<p className='c-topbar-nav__text'>
				{name}{' '}
				{tabHasActiveMovement && (
					<span className='c-active-indicator c-topbar-nav__active-indicator'>
					</span>
				)}
			</p>
		</Link>
	);
}
