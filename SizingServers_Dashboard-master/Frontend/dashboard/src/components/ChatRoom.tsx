import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from '../utils/firebase';
import 'firebase/firestore';

import ChatMessage from './ChatMessage';

export default function ChatRoom() {
	// ! Firebase
	const firestore = firebase.firestore();
	const messagesRef = firestore.collection('/messages');

	const [robotId, setRobotId] = useState<string | undefined>('');

	const location = useLocation();
	const messagesEndRef = useRef(null);

	useEffect(() => {
		getRobotId();
	}, []);

	const scrollToBottom = () => {
		if (messagesEndRef.current != null) {
			// @ts-ignore
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const getRobotId = () => {
		const id = location.pathname.substring(0).split('/')[1];
		setRobotId(String(id));
	};

	const query = messagesRef.where('Robot', '==', robotId).limit(50);

	const [messages] = useCollectionData(query, { idField: 'id' });

	useEffect(scrollToBottom, [messages]);

	return (
		<div className='c-chat__room'>
			{messages &&
				messages
					.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
					.map((msg) => {
						return <ChatMessage key={msg.id} message={msg} />;
					})}
			<div ref={messagesEndRef} />
		</div>
	);
}
