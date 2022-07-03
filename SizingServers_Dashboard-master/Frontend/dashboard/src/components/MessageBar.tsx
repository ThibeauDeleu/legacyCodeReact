export default function MessageBar({
	message,
	type,
	showMessageBar,
	onChangeShowMessage,
	className,
}: {
	message: string;
	type: string;
	showMessageBar: boolean;
	onChangeShowMessage: Function;
	className?: string;
}) {
	return (
		<div
			className={`c-message-bar ${type} ${className} ${
				showMessageBar ? 'is-visible' : ''
			}`}
		>
			<p></p>
			<p className='c-message-bar__text'>{message}</p>
			<button
				className='c-message-bar__cross-button'
				onClick={() => {
					onChangeShowMessage(false);
				}}
			>
				<svg
					className='c-message-bar__cross'
					id='close_black_24dp'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
				>
					<path
						id='Path_47'
						data-name='Path 47'
						d='M0,0H24V24H0Z'
						fill='none'
					/>
					<path
						id='Path_48'
						data-name='Path 48'
						d='M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z'
						fill='white'
					/>
				</svg>
			</button>
		</div>
	);
}
