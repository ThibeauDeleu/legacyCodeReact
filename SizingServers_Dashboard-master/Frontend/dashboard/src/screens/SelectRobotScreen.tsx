import { useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

export default function SelectRobotScreen({
	resetRobotId,
}: {
	resetRobotId: Function;
}) {
	useEffect(() => {
		resetRobotId();
	}, []);
	return (
		<div className='c-lottie-holder'>
			<Player
				autoplay={true}
				loop={true}
				controls={false}
				src={`${window.location.origin}/assets/lottie/selectARobot.json`}
				style={{ height: '22rem', width: '22rem' }}
			></Player>
			<p className='c-lottie__text c-lottie__text--higher u-text__normal--bold'>
				Select a robot to continue.
			</p>
		</div>
	);
}
