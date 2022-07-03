import { useState } from 'react';
import ComponentInterface from '../models/ComponentInterface';
import SliderInterface from '../models/SliderInterface';
import MQTT from '../store/mqttConnect';

export default function Slider({
	slider,
	group,
	navGroup,
	robotName,
	component,
}: {
	slider: SliderInterface;
	group: string;
	navGroup: string;
	robotName: string;
	component: ComponentInterface;
}) {
	const getCenter = (min: number, max: number) => {
		return (min + max) / 2;
	};

	const [value, setValue] = useState<number>(() =>
		getCenter(slider.limits.min, slider.limits.max)
	);

	const sender = () => {
		MQTT.publish(
			JSON.stringify({
				component: component.slug,
				group: navGroup.toLowerCase(),
				motor: slider.slug,
				angle: value,
			}),
			`robot/${robotName.toLowerCase()}/movements/live`
		);
	};

	return (
		<form className='c-slider'>
			<label
				className='c-slider__label u-text__normal--bold u-mb--md'
				htmlFor={`${group}-${slider.name}`}
			>
				{slider.name}
			</label>
			<div className='c-slider__holder'>
				<input
					value={value}
					className='c-slider__input u-mb--lg'
					type='range'
					name={`slider-${group}`}
					id={`${group}-${slider.name}`}
					onChange={(e) => {
						setValue(() => +e.target.value);
					}}
					onClick={sender}
					min={slider.limits.min}
					max={slider.limits.max}
				/>
				<p className='c-slider__value'>{value}°</p>
			</div>
		</form>
	);
}
