import {useState } from 'react';

export default function ChatMessage({ message }: { message: any }) {
	const { text, sender, Me, createdAt } = message;

	const [showTime, setShowTime] = useState<boolean>(false);

	const messageClass = Me === true ? 'c-sent' : 'c-received';
	return (
		<div className={`c-message ${messageClass}`}>
			<p
				onClick={() => {
					setShowTime(!showTime);
				}}
				className='c-message-layout'
			>
				{text}
			</p>
			<p className={`c-message-time ${showTime && 'is-visible'}`}>
					{createdAt && createdAt.toDate().toLocaleString()}
			</p>
		</div>
	);
}
