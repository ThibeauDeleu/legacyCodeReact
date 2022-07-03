import { useState, useEffect, ChangeEvent } from 'react';
import firebase from '../utils/firebase';
import 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation } from 'react-router-dom';
// @ts-ignore
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition';

import MQTT from '../store/mqttConnect';
import RobotInterface from '../models/RobotInterface';
import ChatRoom from '../components/ChatRoom';
import LoadingScreen from './LoadingScreen';
import { Player } from '@lottiefiles/react-lottie-player';
import MessageBar from '../components/MessageBar';
import API from '../utils/api';

export default function ChatbotScreen() {
	const firestore = firebase.firestore();
	const auth = firebase.auth();

	const location = useLocation();
	const [user] = useAuthState(auth);
	const messagesRef = firestore.collection('/messages');

	const [formValue, setFormValue] = useState('');
	const [robotId, setRobotId] = useState<string>('');
	const [robot, setRobot] = useState<RobotInterface | undefined>(undefined);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
	const [canSend, setCanSend] = useState<boolean>(false);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [inputTopic, setInputTopic] = useState<string | undefined>(undefined);

	const {
		transcript,
		listening,
		resetTranscript,
		//@ts-ignore
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

	useEffect(() => {
		GetRobotId();
		if (!browserSupportsSpeechRecognition) {
			setErrorMessage("Browser doesn't support speech recognition.");
			setShowErrorMessage(true);
		} else {
			setShowErrorMessage(false);
		}
	}, []);

	useEffect(() => {
		if (robot) {
			const topic = `robot/${robot!.name.toLowerCase()}/audio/input/robot`;
			setInputTopic(topic);
			MQTT.subscribe(topic);

			return () => MQTT.unsubscribe(topic);
		}
	}, [robot]);

	useEffect(() => {
		if (inputTopic !== undefined) {
			MQTT.client.on('message', mqttRecieve);
		}
	}, [inputTopic]);

	const mqttRecieve = async (topic: string, message: string) => {
		if (topic === inputTopic) {
			// parse to object
			let data = JSON.parse(message.toString());

			await messagesRef.add({
				text: data.message,
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
				Me: false,
				Sender: 'Robot',
				Robot: robotId,
			});
		}
	};

	const getRobot = async (robotId: string) => {
		try {
			const robotdata: RobotInterface = await API.get(`robot/id/${robotId}`);
			setRobot(robotdata);
			setShowErrorMessage(false);
			setIsLoading(false);
			signInWithGoogle();
		} catch (error) {
			console.error(`could not get robot`);
			setShowErrorMessage(true);
			setErrorMessage(`Could not get robot for subscription on MQTT`);
		}
	};

	useEffect(() => {
		if (transcript) {
			setFormValue(transcript);
		}
	}, [transcript]);

	useEffect(() => {
		if (robotId != '') getRobot(robotId);
	}, [robotId]);

	const GetRobotId = () => {
		const id: string = location.pathname.substring(0).split('/')[1];
		setRobotId(id);
	};

	const sendMessage = async () => {
		MQTT.publish(
			`{"text":"${formValue}"}`,
			`robot/${robot!.name.toLowerCase()}/audio/input/speech`
		);

		try {
			await messagesRef.add({
				text: formValue,
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
				Me: true,
				Sender: 'Me',
				Robot: robotId,
			});
			setFormValue('');
			setShowErrorMessage(false);
		} catch (error) {
			setErrorMessage('Could not upload message to Firebase');
			setShowErrorMessage(true);
		}
	};

	useEffect(() => {
		if (formValue != '') {
			setCanSend(true);
		} else {
			setCanSend(false);
		}
	}, [formValue]);

	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		//auth.signInWithPopup(provider);
		auth.signInAnonymously();
	};

	if (isLoading || !user || !robot) {
		return <LoadingScreen />;
	} else {
		return (
			<>
				<MessageBar
					type='error'
					className='c-message-bar__chatbot'
					showMessageBar={showErrorMessage}
					message={errorMessage}
					onChangeShowMessage={() => {
						setShowErrorMessage(false);
					}}
				/>
				<main className='c-chat-container'>
					<header className='c-chat-header'>
						<img
							className='c-chat-header-image'
							src={`${window.location.origin}/assets/img/robots/${
								robot!.name
							}-img.png`}
							alt={`Profile picture of the ${robot!.name} robot.`}
						/>
						<p className='c-chat-header-name u-text__title--sm'>
							{robot!.name}
						</p>
					</header>

					<section className='c-chat'>
						<ChatRoom />
					</section>

					<section className='c-chat-controls'>
						<button
							className={`c-chat-controls__speech o-button-reset ${
								listening && 'is-listening'
							}`}
							onClick={() =>
								listening
									? SpeechRecognition.stopListening()
									: SpeechRecognition.startListening()
							}
						>
							{listening ? (
								<Player
									autoplay={true}
									loop={true}
									controls={true}
									src={`${window.location.origin}/assets/lottie/microphoneRecording.json`}
									style={{ height: '3rem', width: '3rem' }}
								></Player>
							) : (
								<svg
									className='c-chat-controls__speech-icon'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
								>
									<path d='M0,0H24V24H0Z' fill='none' />
									<path d='M12,14a2.987,2.987,0,0,0,2.99-3L15,5A3,3,0,0,0,9,5v6A3,3,0,0,0,12,14Zm5.3-3A5.189,5.189,0,0,1,12,16.1,5.189,5.189,0,0,1,6.7,11H5a6.984,6.984,0,0,0,6,6.72V21h2V17.72A6.968,6.968,0,0,0,19,11Z' />
								</svg>
							)}
						</button>
						<form className='c-chat-form'>
							<input
								className='c-chat-form__input'
								type='text'
								placeholder='Send a message'
								value={formValue}
								onChange={(e) => setFormValue(e.target.value)}
							/>
							<button
								type='submit'
								className={`c-chat-form__send o-button-reset ${
									canSend && 'is-active'
								}`}
								disabled={!canSend}
								onClick={(e) => {
									e.preventDefault();
									sendMessage();
								}}
							>
								<svg
									className='c-chat-form__send-icon'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 20'
								>
									<path
										d='M3.011,25.071,27,14.786,3.011,4.5,3,12.5l17.143,2.286L3,17.071Z'
										transform='translate(-3 -4.5)'
									/>
								</svg>
							</button>
						</form>
					</section>
				</main>
			</>
		);
	}
}
