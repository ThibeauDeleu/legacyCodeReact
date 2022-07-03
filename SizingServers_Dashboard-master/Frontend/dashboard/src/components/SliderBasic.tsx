import { useEffect, useState } from 'react';
import SliderInterface from '../models/SliderInterface';
import MQTT from '../store/mqttConnect';

export default function SliderBasic({
	slider,
	group,
	direction = 'hor',
	getValue,
	navGroup,
	robotName,
}: {
	slider: SliderInterface;
	group: string;
	direction?: string;
	getValue?: Function;
	navGroup: string;
	robotName: string;
}) {
	const getCenter = (min: number, max: number) => {
		return (min + max) / 2;
	};

	const [value, setValue] = useState<number>(
		getCenter(slider.limits.min, slider.limits.max)
	);

	const sender = () => {
		MQTT.publish(
			JSON.stringify({
				component: slider.slug,
				group: navGroup.toLowerCase(),
				motor: slider.slug,
				angle: value,
			}),
			`robot/${robotName.toLowerCase()}/movements/live`
		);
	};

	useEffect(() => {
		if (getValue) getValue(value);
	}, [value]);

	return (
		<form
			className={`c-slider c-slider--head ${
				direction === 'ver' && 'is-vertical'
			}`}
		>
			<input
				value={value}
				className='c-slider__input u-mb--lg'
				type='range'
				name={`slider-${group}`}
				id={`${group}-${slider.name}`}
				onChange={(e) => {
					setValue(+e.target.value);
				}}
				onClick={() => {
					sender();
				}}
				min={slider.limits.min}
				max={slider.limits.max}
			/>
			<p className='c-slider__value '>{value}°</p>
		</form>
	);
}
