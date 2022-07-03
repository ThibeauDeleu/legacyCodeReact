import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import RobotInterface from '../models/RobotInterface';
import API from '../utils/api';
import { convertCamelCaseToSeparate } from '../utils/stringFunctions';
import LoadingScreen from './LoadingScreen';
import NoDataScreen from './NoDataScreen';
import { Link } from 'react-router-dom';

export default function AboutScreen() {
	// ! Robot
	const [robot, setRobot] = useState<RobotInterface>({
		uuid: '1',
		name: 'Loading',
		description: 'Loading',
		picture: 'eliot-profile.svg',
		ip: 'Loading',
		extra_info: {},
	});

	// ! Eror handling
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isNoData, setIsNoData] = useState<boolean>(false);

	// ! Navigation / userexperience
	const [isDevMode, setIsDevMode] = useState<boolean>(false);
	const [uri, setUri] = useState<string>();

	const location = useLocation();

	const getRobot = async (uuid: string) => {
		setIsLoading(true);
		try {
			const robotData: RobotInterface = await API.get(`robot/id/${uuid}`);
			setIsLoading(false);
			setIsNoData(false);
			setRobot(robotData);
		} catch (e) {
			setIsLoading(false);
			setIsNoData(true);
			console.error(e);
		}
	};

	useEffect(() => {
		const state: string | null = localStorage.getItem('@isDevMode');
		if (state) {
			setIsDevMode(state === 'true');
		} else {
			localStorage.setItem('@isDevMode', `false`);
			setIsDevMode(false);
		}
	});

	useEffect(() => {
		const [robotId] = location.pathname.substring(1).split('/');
		getRobot(robotId);
	}, []);

	useEffect(() => {
		splitUrl();
	}, []);

	const splitUrl = () => {
		const robotId = location.pathname.substring(1).split('/')[0];
		setUri(`/${robotId}/editrobot`);
	};

	if (isLoading) {
		return <LoadingScreen />;
	} else if (isNoData) {
		return <NoDataScreen />;
	} else {
		return (
			<section className='c-app__data-item--padding'>
				<article className='c-about'>
					<div className='c-about__item c-about__left'>
						<img
							className='c-about__image'
							src={`${window.location.origin}/assets/img/robots/${robot.picture}`}
							alt={`Profile picture of the ${robot.name} robot.`}
						/>
						<p className='c-about__title u-text__normal--bold'>{robot.name}</p>
						<p className='c-about__description'>{robot.description}</p>
					</div>
					<hr className='c-about__split' />
					<div className='c-about__item'>
						<p className='u-mb--xs u-text__normal--bold'>Address</p>
						<p className='u-mb--md'>{robot.ip}</p>
						{Object.keys(robot.extra_info).map((key) => {
							return (
								<div key={key}>
									<p className='u-mb--xs u-text__normal--bold'>
										{convertCamelCaseToSeparate(key)}
									</p>

									<p className='u-mb--md'>
										{/* @ts-ignore */}
										{robot.extra_info[key]}
									</p>
								</div>
							);
						})}
					</div>
					{isDevMode && (
						<Link
							className='c-button c-button-regular o-button-reset c-about__edit'
							to={`${uri}`}
						>
							Edit
						</Link>
					)}
				</article>
			</section>
		);
	}
}
