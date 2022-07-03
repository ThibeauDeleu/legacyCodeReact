export const alertTypeIcons = {
	critical: (
		<svg
			className='c-alert__icon'
			xmlns='http://www.w3.org/2000/svg'
			enableBackground='new 0 0 24 24'
			viewBox='0 0 24 24'
		>
			<g>
				<rect fill='none' height='24' width='24' y='0' />
			</g>
			<g>
				<path d='M19.48,12.35c-1.57-4.08-7.16-4.3-5.81-10.23c0.1-0.44-0.37-0.78-0.75-0.55C9.29,3.71,6.68,8,8.87,13.62 c0.18,0.46-0.36,0.89-0.75,0.59c-1.81-1.37-2-3.34-1.84-4.75c0.06-0.52-0.62-0.77-0.91-0.34C4.69,10.16,4,11.84,4,14.37 c0.38,5.6,5.11,7.32,6.81,7.54c2.43,0.31,5.06-0.14,6.95-1.87C19.84,18.11,20.6,15.03,19.48,12.35z M10.2,17.38 c1.44-0.35,2.18-1.39,2.38-2.31c0.33-1.43-0.96-2.83-0.09-5.09c0.33,1.87,3.27,3.04,3.27,5.08C15.84,17.59,13.1,19.76,10.2,17.38z' />
			</g>
		</svg>
	),
	warning: (
		<svg
			className='c-alert__icon'
			xmlns='http://www.w3.org/2000/svg'
			height='24px'
			viewBox='0 0 24 24'
			width='24px'
			fill='#000000'
		>
			<path d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' />
		</svg>
	),
	debug: (
		<svg
			className='c-alert__icon'
			xmlns='http://www.w3.org/2000/svg'
			height='24px'
			viewBox='0 0 24 24'
			width='24px'
			fill='#000000'
		>
			<path d='M0 0h24v24H0V0z' fill='none' />
			<path d='M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-4 4v3c0 .22-.03.47-.07.7l-.1.65-.37.65c-.72 1.24-2.04 2-3.46 2s-2.74-.77-3.46-2l-.37-.64-.1-.65C8.03 15.48 8 15.23 8 15v-4c0-.23.03-.48.07-.7l.1-.65.37-.65c.3-.52.72-.97 1.21-1.31l.57-.39.74-.18c.31-.08.63-.12.94-.12.32 0 .63.04.95.12l.68.16.61.42c.5.34.91.78 1.21 1.31l.38.65.1.65c.04.22.07.47.07.69v1zm-6 2h4v2h-4zm0-4h4v2h-4z' />
		</svg>
	),
	error: (
		<svg
			className='c-alert__icon'
			xmlns='http://www.w3.org/2000/svg'
			height='24px'
			viewBox='0 0 24 24'
			width='24px'
		>
			<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' />
		</svg>
	),
	info: (
		<svg
			className='c-alert__icon'
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
		>
			<path id='Path_61' data-name='Path 61' d='M0,0H24V24H0Z' fill='none' />
			<path
				id='Path_62'
				data-name='Path 62'
				d='M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,15H11V11h2Zm0-8H11V7h2Z'
				fill='#44c8f5'
			/>
		</svg>
	),
};
