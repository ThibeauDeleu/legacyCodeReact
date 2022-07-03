import { Player } from '@lottiefiles/react-lottie-player';

export default function NoDataScreen() {
	return (
		<div className='c-lottie-holder c-app__data-item--padding'>
			<Player
				className='c-lottie'
				autoplay={true}
				loop={false}
				controls={false}
				keepLastFrame={true}
				src={`${window.location.origin}/assets/lottie/notFound.json`}
				style={{ height: '22rem', width: '22rem' }}
			></Player>
			<p className='c-lottie__text u-text__normal--bold'>
				Can't find the robot data, try again 😥.
			</p>
		</div>
	);
}
