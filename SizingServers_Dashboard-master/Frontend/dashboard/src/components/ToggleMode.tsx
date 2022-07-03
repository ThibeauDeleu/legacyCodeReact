import { ChangeEvent } from 'react';

export default function ToggleMode({
	isDevMode,
	onChangeDevMode,
}: {
	isDevMode: boolean;
	onChangeDevMode: Function;
}) {
	return (
		<div className='c-toggle'>
			<input
				className='c-toggle__input o-hide-accessible'
				type='checkbox'
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					onChangeDevMode(e.target.checked);
				}}
				id='devmode'
				checked={isDevMode}
			/>
			<label className='c-toggle__label u-text__normal--sm' htmlFor='devmode'>
				Mode
				<span className='c-toggle__fake-input'></span>
			</label>
		</div>
	);
}
