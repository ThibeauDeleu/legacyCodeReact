import { useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

export default function LoadingScreen({
	resetRobotId,
}: {
	resetRobotId?: Function;
}) {
	const [quotes, setQuotes] = useState<string[]>([
		'Everything comes in time to those who can wait for exceptions.',
		"Patience is not simply the ability to wait - it's how we behave while we're waiting.",
		'Robotics is happiness. Waiting is life.',
		'If we wait until we are ready, we will be waiting for the rest of our lives.',
	]);

	useEffect(() => {
		if (resetRobotId) {
			resetRobotId();
		}
	}, []);

	return (
		<div className='c-lottie-holder'>
			<Player
				autoplay={true}
				loop={true}
				controls={true}
				src={`${window.location.origin}/assets/lottie/loading.json`}
				style={{ height: '22rem', width: '22rem' }}
			></Player>
			<p className='c-lottie__text u-text__normal--bold'>
				{quotes[Math.floor(Math.random() * quotes.length)]}
			</p>
		</div>
	);
}
