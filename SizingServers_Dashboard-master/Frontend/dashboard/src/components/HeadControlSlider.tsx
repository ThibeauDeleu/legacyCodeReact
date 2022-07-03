import { useState } from 'react';
import ComponentInterface from '../models/ComponentInterface';
import SliderInterface from '../models/SliderInterface';
import SliderBasic from './SliderBasic';

export default function HeadControlSlider({
	control,
}: {
	control: ComponentInterface;
}) {
	const checkDirection = (
		direciton: string,
		sliders: SliderInterface[]
	): SliderInterface | undefined => {
		return sliders.find(
			(slider: SliderInterface) => slider.direction === direciton
		);
	};

	const [verticalSlider] = useState<SliderInterface | undefined>(
		checkDirection('ver', control.controls.slider)
	);
	const [horizontalSlider] = useState<SliderInterface | undefined>(
		checkDirection('hor', control.controls.slider)
	);

	const [vertical, setVertical] = useState<number>(0);
	const [horizontal, setHorizontal] = useState<number>(0);

	const handleVerSlider = (value: number) => {
		setVertical(value);
	};

	const handleHorSlider = (value: number) => {
		setHorizontal(value);
	};

	return (
		<article className='c-slider-head'>
			<div className='c-slider-head__head c-slider-head__item'>
				<svg
					viewBox='0 0 160 134'
					xmlns='http://www.w3.org/2000/svg'
					style={{
						transform: `rotateX(${vertical}deg) rotateY(${horizontal}deg)`,
					}}
					className='c-slider-head__head-icon'
				>
					<g
						transform='matrix(.998 -.07 .07 .998 4.741 13.553)'
						data-name='Group 61'
					>
						<g transform='translate(0 55.912)' data-name='Group 55'>
							<path
								d='M8.647,18.159A9.085,9.085,0,0,1,9.523.011'
								data-name='Path 25'
							/>
							<path
								transform='translate(134.05 9.144)'
								d='M0,18.435A9.06,9.06,0,0,0,9.257,9.583,9.063,9.063,0,0,0,.758,0'
								data-name='Path 26'
							/>
						</g>
						<path
							transform='translate(11.49 30.267)'
							d='M107.668,78.755c-.194,0-.387-.011-.58-.022L8.566,72.2A9.411,9.411,0,0,1,.021,62.034L3.443,9a9.44,9.44,0,0,1,9.221-9c.182,0,.367,0,.561.011l98.531,6.532A9.411,9.411,0,0,1,120.3,16.711l-3.421,53.027A9.475,9.475,0,0,1,107.668,78.755Zm-33.745-20-.236,3.756,3.691.237L77.626,59l-3.7-.247Zm-8.908-.592-.239,3.756,3.692.247.247-3.755-3.7-.247Zm-8.91-.581-.236,3.745,3.691.247.236-3.745L56.1,57.579Zm-8.91-.592-.236,3.745,3.691.247.249-3.744-3.7-.248Zm-8.908-.592-.239,3.745,3.692.248.247-3.745-3.7-.247ZM27.513,16.528A11.651,11.651,0,0,0,15.882,27.514l-.086,1.3a11.742,11.742,0,0,0,10.8,12.5l65.52,4.326c.236.011.485.022.721.022a11.6,11.6,0,0,0,7.715-2.938,11.732,11.732,0,0,0,3.885-8.038l.086-1.3A11.722,11.722,0,0,0,93.723,20.9L28.2,16.55C27.934,16.537,27.726,16.528,27.513,16.528Z'
							data-name='Subtraction 2'
						/>
						<g transform='translate(35.04)' data-name='Group 58'>
							<g transform='translate(62.706 4.483)' data-name='Group 56'>
								<path
									d='M8.671,18.569h0A9.069,9.069,0,0,1,.02,9.1l.057-.826A9.045,9.045,0,0,1,9.867.021h0A9.085,9.085,0,0,1,18.512,9.5l-.056.82A9.043,9.043,0,0,1,8.671,18.569Z'
									data-name='Path 28'
								/>
								<path
									transform='translate(6.413 17.277)'
									d='M4.544.18.4,0,0,9.875l4.14.18Z'
									data-name='Path 29'
								/>
							</g>
							<g data-name='Group 57'>
								<path
									d='M8.629,18.581h0A9.078,9.078,0,0,1,.018,9.11l.051-.82A9.032,9.032,0,0,1,9.842.033h0A9.074,9.074,0,0,1,18.448,9.5l-.051.82a9.026,9.026,0,0,1-9.768,8.257Z'
									data-name='Path 30'
								/>
								<path
									transform='translate(6.399 11.773)'
									d='M4.792.185.646,0,0,15.391l4.145.18Z'
									data-name='Path 31'
								/>
							</g>
						</g>
						<g transform='translate(72.271 43.644)' data-name='Group 59'>
							<path
								transform='translate(9.325)'
								d='M9.521,36.994,0,32.747,14.206,0l9.521,4.247Z'
								data-name='Path 34'
							/>
							<path
								transform='translate(0 .096)'
								d='M3.87,34.483,0,32.759,14.177,0l3.87,1.724Z'
								data-name='Path 35'
							/>
						</g>
					</g>
					<rect
						width='160'
						height='134'
						fill='none'
						data-name='Rectangle 204'
					/>
				</svg>
			</div>
			<div className='c-slider-head__slider--vert c-slider-head__item'>
				{verticalSlider && (
					<SliderBasic
						slider={verticalSlider}
						group='head'
						direction='ver'
						getValue={handleVerSlider}
						navGroup={control.group}
						robotName={control.robot.name}
					/>
				)}
			</div>
			<div className='c-slider-head__slider--hor c-slider-head__item'>
				{horizontalSlider && (
					<SliderBasic
						slider={horizontalSlider}
						group='head'
						getValue={handleHorSlider}
						navGroup={control.group}
						robotName={control.robot.name}
					/>
				)}
			</div>
			<div className='c-slider-head__empty'></div>
		</article>
	);
}
