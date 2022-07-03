import { Joystick } from 'react-joystick-component';
import MQTT from '../store/mqttConnect';
import ComponentInterface from '../models/ComponentInterface';
import { setFirstLetterUpper } from '../utils/stringFunctions';
import JoystickInterface from '../models/JoystickInterface';

export default function JoystickComponent({
	control,
	joystick,
}: {
	control: ComponentInterface;
	joystick: JoystickInterface;
}) {
	const sendFunction = (e: any) => {
		var rad = Math.atan2(e.y, e.x); // In radians
		var deg = (rad * 180) / Math.PI; //als je de graden van de joystick wilt

		MQTT.publish(
			JSON.stringify({
				component: control.slug,
				group: control.group.toLowerCase(),
				motor: joystick.slug,
				angle: deg,
				values: { x: e.x / 56, y: e.y / 56 },
			}),
			`robot/${control.robot.name.toLowerCase()}/movements/live`
		);
	};

	return (
		<div className='c-joystick'>
			<p className='c-joystick__name u-text__normal--bold u-mb--md'>
				{setFirstLetterUpper(joystick.name)}
			</p>
			<div className='c-joystick__container'>
				<div className='c-joystick__holder'>
					<Joystick
						size={112}
						baseColor={getComputedStyle(document.body).getPropertyValue(
							'--global-color-neutral-100'
						)}
						stickColor={getComputedStyle(document.body).getPropertyValue(
							'--global-color-theme-900'
						)}
						move={(e) => {
							sendFunction(e);
						}}
						stop={() => {}}
						throttle={500}
					></Joystick>
				</div>
			</div>
		</div>
	);
}
