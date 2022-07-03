import { useContext, useEffect, useState } from 'react';

import JoystickComponent from './JoystickComponent';
import Slider from '../components/Slider';
import HeadControlSlider from '../components/HeadControlSlider';
import { activeMovementsContext } from '../store/activeMovements';
import MQTT from '../store/mqttConnect';
import JoystickInterface from '../models/JoystickInterface';
import ComponentInterface from '../models/ComponentInterface';

export default function Control({
	component,
}: {
	component: ComponentInterface;
}) {
	// Todo: This page works for now, but is made to be future proof. There are many console logs to help you understand the flow and adapt it in the future.

	// ! Page data
	const [showJoystick, setShowJoystick] = useState<boolean>(false);
	const [isAccessible, setIsAccessible] = useState<boolean>(true);
	const [isActivated, setIsActivated] = useState<boolean>(false);

	const { activeMovements, setActiveMovements } = useContext(
		activeMovementsContext
	);

	const checkIfActiveMovementIsThis = () => {
		if (
			// @ts-ignore
			activeMovements[component.robot.name].control.length > 0
		) {
			if (
				// @ts-ignore
				activeMovements[component.robot.name].control.includes(component.uuid)
			) {
				// console.log(
				// 	`${component.name} is the active control from ${component.robot.name}`
				// );
				setIsAccessible(true);
				setIsActivated(true);
			} else {
				// console.log(
				// 	`${component.name} is not accesible control from ${component.robot.name}`
				// );
				setIsAccessible(false);
			}
		} else {
			setIsAccessible(true);
		}
	};

	const checkIfIsAccessible = () => {
		if (component.robot.name in activeMovements) {
			// console.log(
			// 	`${component.robot.name} found, something is active in group control.`
			// );
			// @ts-ignore
			if ('control' in activeMovements[component.robot.name]) {
				checkIfActiveMovementIsThis();
			} else {
				// ! Normal this can be true, but for now if a robot is doing something (present in object), he can't do anything else.
				setIsAccessible(false);
			}
		} else {
			// console.log(
			// 	`${component.robot.name} is not found in the active movements context`
			// );
			setIsAccessible(true);
		}
	};

	useEffect(() => {
		checkIfIsAccessible();
	}, [activeMovements]);

	const makeUnActivated = () => {
		setIsActivated(false);

		MQTT.publish(
			`{}`,
			`robot/${component.robot.name.toLowerCase()}/movements/live/stop`
		);

		setActiveMovements((prev: any) => {
			// for (
			// 	var i = 0;
			// 	i <
			// 	//@ts-ignore
			// 	prev[movement.robot.name][movement.movement_type].length;
			// 	i++
			// ) {
			// 	if (
			// 		//@ts-ignore
			// 		prev[movement.robot.name][movement.movement_type][i] ===
			// 		movement.uuid
			// 	) {
			// 		//@ts-ignore
			// 		// ! code if multiple thing can be on (future)
			// 		// prev[movement.robot.name][movement.movement_type].splice(i, 1);
			// 	}
			// }
			// ! code if something is active form robot, nothing else can (now);
			// ! delete all data of this robot
			delete prev[component.robot.name];
			return { ...prev };
		});
	};

	const handleActivateButton = () => {
		if (isActivated) {
			makeUnActivated();
		} else {
			makeActivated();
		}
	};

	const makeActivated = () => {
		setIsActivated(true);
		MQTT.publish(
			`{}`,
			`robot/${component.robot.name.toLowerCase()}/movements/live/start`
		);

		let activeMovementsCurrent = activeMovements;
		// @ts-ignore
		if (component.robot.name in activeMovements) {
			// console.log('active movements found from', component.robot.name);
			// ! not worked out because there is no check from the backend yet
		} else {
			// console.log('no active movement from', component.robot.name);
			activeMovementsCurrent = {
				...activeMovementsCurrent,
				[component.robot.name]: {
					control: [component.uuid],
				},
			};
			setActiveMovements(activeMovementsCurrent);
		}
	};

	return (
		<article
			className={`c-control ${
				(!isAccessible || !isActivated) && 'is-not-accessible'
			}`}
		>
			<div className='c-control__header u-mb--lg'>
				<h2>{component.name.replace(/^./, (str) => str.toUpperCase())}</h2>
				<button
					onClick={handleActivateButton}
					className={`c-button o-button-reset c-button-regular c-control__activate-button ${
						isActivated && 'is-activated'
					} ${!isAccessible && 'is-not-accesible'}`}
				>
					{isActivated ? 'Deactivate' : 'Activate'}
				</button>
			</div>
			{component.controls.joystick && component.controls.slider && (
				<div className='c-togglebutton'>
					<input
						className='c-togglebutton-option__input o-hide-accessible'
						type='radio'
						name={`control-type-${component.name}`}
						id={`slider-${component.name}`}
						checked={!showJoystick}
						onChange={() => {}}
					/>
					<label
						className='c-togglebutton-option__label c-togglebutton-option__label--left'
						htmlFor={`slider-${component.name}`}
						onClick={(e) => {
							e.preventDefault();
							setShowJoystick(false);
						}}
					>
						Sliders
					</label>
					<input
						className='c-togglebutton-option__input o-hide-accessible'
						type='radio'
						name={`control-type-${component.name}`}
						id={`joystick-${component.name}`}
						checked={showJoystick}
						onChange={() => {}}
					/>
					<label
						className='c-togglebutton-option__label c-togglebutton-option__label--right'
						htmlFor={`joystick-${component.name}`}
						onClick={(e) => {
							e.preventDefault();
							setShowJoystick(true);
						}}
					>
						Joysticks
					</label>
				</div>
			)}
			<div className={`c-control-carousel ${showJoystick && 'show-joystick'}`}>
				<div className='c-control-carousel__viewport'>
					{component.controls.slider && (
						<article
							className={`c-control-carousel__viewport-item c-control__slider ${
								component.name.toLowerCase() === 'head' && 'is-svg-slider'
							}`}
						>
							{component.name.toLowerCase() === 'head' ? (
								<HeadControlSlider control={component} />
							) : (
								<div className='c-control__slider-grid'>
									{component.controls.slider &&
										component.controls.slider.map((slider: any) => {
											return (
												<Slider
													key={`slider-${slider.name}`}
													slider={slider}
													group={component.name.toLowerCase()}
													navGroup={component.group}
													robotName={component.robot.name}
													component={component}
												/>
											);
										})}
								</div>
							)}
						</article>
					)}
					{component.controls.joystick && (
						<article className='c-control-carousel__viewport-item c-control__joystick'>
							{component.controls.joystick &&
								component.controls.joystick.map(
									(joystick: JoystickInterface) => {
										return (
											<JoystickComponent
												key={joystick.name}
												control={component}
												joystick={joystick}
											/>
										);
									}
								)}
						</article>
					)}
				</div>
			</div>
		</article>
	);
}
