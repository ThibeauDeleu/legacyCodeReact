import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';

import MovementInterface from '../models/MovementInterface';
import { activeMovementsContext } from '../store/activeMovements';
import InformationOverlay from './InformationOverlay';
import MQTT from '../store/mqttConnect';
import { setFirstLetterUpper} from '../utils/stringFunctions';

export default function MovementCard({
	movement,
	onUpdateMovement,
}: {
	movement: MovementInterface;
	onUpdateMovement: Function;
}) {
	// Todo: This page works for now, but is made to be future proof. There are many console logs to help you understand the flow and adapt it in the future.

	// ! Page data
	const [uri, setUri] = useState<string>();
	const [isActive, setIsActive] = useState<boolean>(false);
	const [isDevMode, setIsDevMode] = useState<boolean>(false);
	const [showInformation, setShowInformation] = useState<boolean>(false);
	const [isAccessible, setIsAccessible] = useState<boolean>(true);
	const [stopTopic, setStopTopic] = useState<string>('');
	const [showInput, setShowInput] = useState<boolean>(false);
	const [payload, setPayload] = useState<string>(
		JSON.stringify(movement.payload)
	);

	// ! Error handling
	const [showPayloadError, setShowPayloadError] = useState<boolean>(false);

	const location = useLocation();

	const { activeMovements, setActiveMovements } = useContext(
		activeMovementsContext
	);

	const handleChangeShowInformation = (state: boolean) => {
		setShowInformation(state);
	};

	const subscribeToEnd = () => {
		const topic = `robot/${movement.robot.name.toLowerCase()}/done`;
		setStopTopic(topic);
		MQTT.subscribe(topic);
	};

	const mqttRecieve = (topic: string, message: string) => {
		// afzetten active
		if (topic === stopTopic) {
			stopMovement();
			MQTT.unsubscribe(stopTopic);
		}
	};

	useEffect(() => {
		if (stopTopic !== '') {
			MQTT.client.on('message', mqttRecieve);
		}
	}, [stopTopic]);

	useEffect(() => {
		splitUrl();
	}, []);

	const splitUrl = () => {
		const robotId = location.pathname.substring(1).split('/')[0];
		const movementId = movement.uuid;

		setUri(`/${robotId}/editmovement/${movementId}`);
	};

	const startMovement = () => {
		if (!showPayloadError) {
			let customPayload: string = '{}';
			if (movement.payload) {
				customPayload = payload;
			}
			// ! Toevoegen uuid
			let payloadObject = JSON.parse(customPayload);
			payloadObject.uuid = movement.uuid;

			let activeMovementsCurrent = activeMovements;
			setIsActive(true);
			setShowInput(false);
			subscribeToEnd();
			MQTT.publish(
				JSON.stringify(payloadObject),
				`robot/${movement.robot.name.toLowerCase()}/${
					movement.slug.split('-')[0]
				}`
			);
			// @ts-ignore
			if (movement.robot.name in activeMovements) {
				// console.log('active movements found from', movement.robot.name);
			} else {
				// console.log('no active movement from', movement.robot.name);
				activeMovementsCurrent = {
					...activeMovementsCurrent,
					[movement.robot.name]: {
						[movement.movement_type.toLowerCase()]: [movement.uuid],
					},
				};
				setActiveMovements(activeMovementsCurrent);
			}
		}
	};

	const checkPayload = () => {
		if (movement.payload) {
			setShowInput(true);
		} else {
			startMovement();
		}
	};

	const handleStartStop = () => {
		if (isActive) {
			MQTT.publish(
				'{"command": "stop"}',
				`robot/${movement.robot.name.toLowerCase()}/${movement.slug}`
			);
			stopMovement();
		} else {
			checkPayload();
		}
	};

	const stopMovement = () => {
		setIsActive(false);
		setActiveMovements((prev: any) => {
			// for (
			// 	var i = 0;
			// 	i <
			// 	//@ts-ignore
			// 	prev[movement.robot.name][movement.movement_type.toLowerCase()].length;
			// 	i++
			// ) {
			// 	if (
			// 		//@ts-ignore
			// 		prev[movement.robot.name][movement.movement_type.toLowerCase()][i] ===
			// 		movement.uuid
			// 	) {
			// 		//@ts-ignore
			// 		// ! code if multiple thing can be on (future)
			// 		// prev[movement.robot.name][movement.movement_type.toLowerCase()].splice(i, 1);
			// 	}
			// }
			// ! code if something is active form robot, nothing else can (now);
			// ! delete all data of this robot
			delete prev[movement.robot.name];
			return { ...prev };
		});
	};

	useEffect(() => {
		const state: string | null = localStorage.getItem('@isDevMode');
		if (state) {
			setIsDevMode(state === 'true');
		}
	});

	const checkIfActiveMovementIsThis = () => {
		if (
			// @ts-ignore
			activeMovements[movement.robot.name][movement.movement_type.toLowerCase()]
				.length > 0
		) {
			if (
				// @ts-ignore
				activeMovements[movement.robot.name][
					movement.movement_type.toLowerCase()
				].includes(movement.uuid)
			) {
				// console.log(
				// 	`${
				// 		movement.name
				// 	} is the active ${movement.movement_type.toLowerCase()} from ${
				// 		movement.robot.name
				// 	}`
				// );
				setIsAccessible(true);
				setIsActive(true);
			} else {
				// console.log(
				// 	`${
				// 		movement.name
				// 	} is not accesible ${movement.movement_type.toLowerCase()} from ${
				// 		movement.robot.name
				// 	}`
				// );
				setIsAccessible(false);
				setIsActive(false);
			}
		} else {
			setIsActive(false);
			setIsAccessible(true);
		}
	};

	const checkIfIsAccessible = () => {
		if (movement.robot.name in activeMovements) {
			if (
				movement.movement_type.toLowerCase() in
				// @ts-ignore
				activeMovements[movement.robot.name]
			) {
				// console.log(
				// 	`${
				// 		movement.robot.name
				// 	} found, something is active in group ${movement.movement_type.toLowerCase()}.`
				// );
				checkIfActiveMovementIsThis();
			} else {
				// console.log(
				// 	`${
				// 		movement.robot.name
				// 	} found, nothing active in ${movement.movement_type.toLowerCase()}.`
				// );
				// ! Normal this can be true, but for now if a robot is doing something (present in object), he can't do anything else.
				setIsAccessible(false);
			}
		} else {
			setIsAccessible(true);
		}
	};

	const checkInput = (input: string) => {
		setPayload(input);
		try {
			JSON.parse(payload);
			setShowPayloadError(false);
		} catch (error) {
			setShowPayloadError(true);
		}
	};

	useEffect(() => {
		checkIfIsAccessible();
	}, [activeMovements]);

	if (movement.in_development && !isDevMode) {
		return null;
	}
	return (
		<article
			className={`c-movement ${
				!isAccessible && !isActive && 'is-not-accessible'
			}`}
		>
			{/* This div is used to handle the click for starting/stopping. */}
			<button
				onClick={() => {
					isAccessible && handleStartStop();
				}}
				className='c-movement-clickable o-button-reset'
			>
				<h2 className='c-movement-title'>
					{setFirstLetterUpper(movement.name)}
				</h2>
				<div className='c-movement-button c-movement-button__play'>
					{isActive ? (
						<svg
							className='c-movement-button__start-stop c-movement-button__stop'
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
						>
							<rect width='24' height='24' fill='none' />
							<path
								d='M8,16h8V8H8ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Z'
								fillRule='evenodd'
							/>
						</svg>
					) : (
						<svg
							className='c-movement-button__start-stop c-movement-button__start'
							id='play_circle_filled_black_24dp'
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
						>
							<path
								id='Path_67'
								data-name='Path 67'
								d='M0,0H24V24H0Z'
								fill='none'
							/>
							<path
								id='Path_68'
								data-name='Path 68'
								d='M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM10,16.5v-9L16,12Z'
							/>
						</svg>
					)}
				</div>
			</button>

			<div>
				<hr className='c-movement-split c-movement-split--horizontal' />
				{!isDevMode ? (
					<button
						onClick={() => setShowInformation(true)}
						className='c-movement-button o-button-reset'
					>
						<svg
							className='c-movement-button__icon'
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
						>
							<path d='M0 0h24v24H0z' fill='none' />
							<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' />
						</svg>
						<p className='c-movement-button__text'> information</p>
					</button>
				) : (
					<div
						className={`c-movement-develop-settings ${
							isActive ? 'is-active' : ''
						}`}
					>
						<button
							onClick={() => {
								if (!isActive && isAccessible) {
									onUpdateMovement({
										uuid: movement.uuid,
										in_development: !movement.in_development,
									});
								}
							}}
							className='c-movement-button c-movement-button-1-of-2 o-button-reset'
						>
							{movement.in_development ? (
								<svg
									className='c-movement-button__icon c-movement-button__icon-in-dev'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
								>
									<path
										d='M0,0H24V24H0ZM0,0H24V24H0ZM0,0H24V24H0ZM0,0H24V24H0Z'
										fill='none'
									/>
									<path d='M12,7a5,5,0,0,1,5,5,4.853,4.853,0,0,1-.36,1.83l2.92,2.92A11.817,11.817,0,0,0,22.99,12a11.827,11.827,0,0,0-11-7.5,11.645,11.645,0,0,0-3.98.7l2.16,2.16A4.853,4.853,0,0,1,12,7ZM2,4.27,4.28,6.55l.46.46A11.8,11.8,0,0,0,1,12a11.822,11.822,0,0,0,15.38,6.66l.42.42L19.73,22,21,20.73,3.27,3ZM7.53,9.8l1.55,1.55A2.821,2.821,0,0,0,9,12a3,3,0,0,0,3,3,2.821,2.821,0,0,0,.65-.08l1.55,1.55A4.967,4.967,0,0,1,7.53,9.8Zm4.31-.78,3.15,3.15.02-.16a3,3,0,0,0-3-3Z' />
								</svg>
							) : (
								<svg
									className='c-movement-button__icon'
									id='visibility_black_24dp'
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
								>
									<path
										id='Path_74'
										data-name='Path 74'
										d='M0,0H24V24H0Z'
										fill='none'
									/>
									<path
										id='Path_75'
										data-name='Path 75'
										d='M12,4.5A11.827,11.827,0,0,0,1,12a11.817,11.817,0,0,0,22,0A11.827,11.827,0,0,0,12,4.5ZM12,17a5,5,0,1,1,5-5A5,5,0,0,1,12,17Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,12,9Z'
									/>
								</svg>
							)}
						</button>
						<hr className='c-movement-split c-movement-split--vertical' />
						<Link
							className='c-movement-button c-movement-button-1-of-2 o-button-reset'
							to={`${uri}`}
						>
							<svg
								className='c-movement-button__icon'
								id='edit_black_24dp'
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
							>
								<path
									id='Path_51'
									data-name='Path 51'
									d='M0,0H24V24H0Z'
									fill='none'
								/>
								<path
									id='Path_52'
									data-name='Path 52'
									d='M3,17.25V21H6.75L17.81,9.94,14.06,6.19ZM20.71,7.04a1,1,0,0,0,0-1.41L18.37,3.29a1,1,0,0,0-1.41,0L15.13,5.12l3.75,3.75,1.83-1.83Z'
								/>
							</svg>
						</Link>
					</div>
				)}
			</div>
			<InformationOverlay
				movement={movement}
				showInformation={showInformation}
				onChangeShowInformation={handleChangeShowInformation}
			/>
			{movement.payload && (
				<div className={`c-overlay ${showInput && 'is-visible'}`}>
					<svg
						className='c-overlay__close'
						onClick={() => {
							setShowInput(false);
						}}
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						fill='#000000'
					>
						<path d='M0 0h24v24H0z' fill='none' />
						<path d='M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' />
					</svg>
					<form className='c-movement-information'>
						<h2 className='u-mb--md'>Custom payload</h2>
						<label
							className='c-movement-payload__label'
							htmlFor={`custom-payload-${movement.uuid}`}
						>
							Payload
						</label>
						<textarea
							className={`c-movement-payload__input ${
								showPayloadError && 'error'
							}`}
							name='payload'
							id={`custom-payload-${movement.uuid}`}
							value={payload}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
								checkInput(e.target.value);
							}}
						/>
						<p
							className='c-error-text'
							style={{ display: showPayloadError ? 'block' : 'none' }}
						>
							Payload must be JSON format.
						</p>
						<button
							className='o-button-reset c-button c-movement-payload__start-button'
							type='submit'
							onClick={(e) => {
								e.preventDefault();
								startMovement();
							}}
						>
							Start
						</button>
					</form>
				</div>
			)}
		</article>
	);
}
