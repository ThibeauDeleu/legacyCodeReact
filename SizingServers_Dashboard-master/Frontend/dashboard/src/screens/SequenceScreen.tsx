import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import ActionCardAdd from '../components/ActionCardAdd';
import MovementInterface from '../models/MovementInterface';
import { activeMovementsContext } from '../store/activeMovements';
import API from '../utils/api';
import LoadingScreen from './LoadingScreen';
import NoDataScreen from './NoDataScreen';
import MovementCard from '../components/MovementCard';
import MessageBar from '../components/MessageBar';

export default function SequenceScreen() {
	// ! Page data
	const [isDevMode, setIsDevMode] = useState<boolean>(false);
	const [sequences, setSequences] = useState<MovementInterface[]>([]);

	// ! Navigation / userexperience
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isNoData, setIsNoData] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

	const location = useLocation();

	useEffect(() => {
		const state: string | null = localStorage.getItem('@isDevMode');
		if (state) {
			setIsDevMode(state === 'true');
		}
	});

	useEffect(() => {
		const [robotId] = location.pathname.substring(1).split('/');
		if (robotId != null) {
			getSequences(robotId);
		}
	}, []);

	const getSequences = async (robotId: string) => {
		try {
			let movementData: MovementInterface[] = await API.get(
				`movement/robot/${robotId}`
			);
			movementData = movementData.filter(
				(sequence: MovementInterface) =>
					sequence.movement_type.split('|')[0].toLowerCase() === 'sequence'
			);
			setIsLoading(false);
			setIsNoData(false);
			setSequences(movementData);
		} catch (error) {
			setIsLoading(false);
			setIsNoData(true);
			console.error(error);
		}
	};

	const handleUpdateMovement = async (data: MovementInterface) => {
		try {
			const response: MovementInterface = await API.put('movement', data);
			setSequences((prev: MovementInterface[]) => {
				for (const movement of prev) {
					if (movement.uuid === response.uuid) {
						movement.in_development = response.in_development;
						break;
					}
				}
				return [...prev];
			});
		} catch (error) {
			setErrorMessage(`Could not update sequence with ID ${data.uuid}`);
			setShowErrorMessage(true);
			console.error(`Could not update ${data}`);
		}
	};

	if (isLoading) {
		return <LoadingScreen />;
	} else if (isNoData) {
		return <NoDataScreen />;
	} else {
		return (
			<section className='c-sequence-demo-grid c-app__data-item--padding'>
				<MessageBar
					message={errorMessage}
					type='error'
					showMessageBar={showErrorMessage}
					className='c-message-bar'
					onChangeShowMessage={(value: boolean) => setShowErrorMessage(value)}
				/>
				{isDevMode && <ActionCardAdd type='sequence' />}
				{sequences.map((sequence: MovementInterface) => {
					return (
						<MovementCard
							key={sequence.uuid}
							movement={sequence}
							onUpdateMovement={handleUpdateMovement}
						/>
					);
				})}
			</section>
		);
	}
}
