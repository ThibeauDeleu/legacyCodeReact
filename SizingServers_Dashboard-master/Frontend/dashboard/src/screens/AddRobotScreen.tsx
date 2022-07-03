import { ChangeEvent, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
 
import MessageBar from '../components/MessageBar';
import MovementInterface from '../models/MovementInterface'
import API from '../utils/api';

export default function AddRobotScreen() {

	const errorStyle = '1px solid var(--global-color-red-500)';

	const location = useLocation();
	let history = useHistory();
	const [messageBalk, setMessageBar] = useState<boolean>(false);
	const [messageBarType, setMessageBarType] = useState<string>('error');
	const [message, setMessage] = useState<string>('Could not create robot');

	const [errorName, setErrorName] = useState<boolean>(false);
	const [errorIp, setErrorIp] = useState<boolean>(false);
	const [errorDesc, setErrorDesc] = useState<boolean>(false);
	const [errorfile, setErrorFile] = useState<boolean>(false);
	const [errorExtra, setErrorExtra] = useState<boolean>(false);
	const [errorJson, setErrorJson] = useState<boolean>(false);

	const [dataIp, setDataIp] = useState<string>('');
	const [dataName, setDataName] = useState<string>('');
	const [dataDesc, setDataDesc] = useState<string>('');
	const [dataExtra, setDataExtra] = useState<string>('');
    const [dataPic, setDataPic] = useState<string>();


	const checkInputs = () => {
		setMessageBarType('error');
		setMessage('Could not add robot')

		if (dataName === '' || dataIp === '' || dataDesc === '' || dataExtra === '' || dataPic === '') {
			setMessageBar(true);
		} else {
			setMessageBar(false);
		}

		if(dataName === '') setErrorName(true)
		else setErrorName(false);
		if(dataIp === '') setErrorIp(true)
		else setErrorIp(false);
		if(dataPic === '')setErrorFile(true)
		else setErrorFile(false);
		if(dataDesc === '')setErrorDesc(true)
		else setErrorDesc(false);
		if(dataExtra === '')setErrorExtra(true)
		else setErrorExtra(false);

		if (dataName !== '' && dataPic !== '' &&  dataDesc !== '' && dataExtra !== '') {
			setErrorName(false);
			setErrorIp(false);
			setErrorFile(false);
			setErrorDesc(false);
			setErrorExtra(false);

			setMessageBar(false);
			PostRobot()
		} 
	};

	const PostRobot = async () => {
		try{
			const body ={
				uuid: uuidv4(),
				name: dataName,
				description: dataDesc,
				picture: dataPic,
                ip: dataIp,
                extra_info: JSON.parse(dataExtra)
			}
			const response: MovementInterface = await API.post('robot',body);
			setMessageBar(true)
			setMessageBarType('succes')
			setMessage('Robot added succesfully')

		}catch(error){
			console.log(error);
			setMessageBar(true)
			setMessageBarType('error')
			setMessage('Adding robot failed')
		}
	}

	const getDataIp = (event: ChangeEvent<HTMLInputElement>) => {
		setDataIp(event.target.value);
	};

	const getDataName = (event: ChangeEvent<HTMLInputElement>) => {
		setDataName(event.target.value);
	};

    const getDataPicture = (event: ChangeEvent<HTMLInputElement>) => {
		setDataPic(event.target.value);
	};

	const getDataDesc = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setDataDesc(event.target.value);
	};

    const getDataExtra = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setDataExtra(event.target.value);
		try{
			console.log(JSON.parse(event.target.value));
			setErrorJson(false);
		}catch (error) {
			setErrorJson(true);
		}
	};

	return (
		<section className='c-app__data-item--padding c-app__add-robot-screen'>
			<article className='c-form'>
				<MessageBar
					message={`${message}`}
					type={`${messageBarType}`}
					showMessageBar={messageBalk}
					className='c-message-bar__no-header'
					onChangeShowMessage={(value: boolean) => setMessageBar(value)}
				/>
				<header className='c-form-header'>
					<div className='c-form-header-title__container'>
						<button style={{all:'unset'}}
							onClick={() => {
								history.goBack();
							}}
						>
							<svg className='c-form-back-arrow' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<g id="expand_more_black_24dp" transform="translate(24) rotate(90)">
									<path id="Path_55" data-name="Path 55" d="M0,0H24V24H0Z" fill="none"/>
									<path id="Path_56" data-name="Path 56" d="M16.59,8.59,12,13.17,7.41,8.59,6,10l6,6,6-6Z"/>
								</g>
							</svg>
						</button>
						<h1 className='c-form-header-title'>Add robot</h1>
					</div>
					<button
						className='c-form-button'
						onClick={() => {
							checkInputs();
						}}
					>
						Save
					</button>
				</header>

				<section className='c-form-data-row c-form-data-gutter'>
					<div className='c-form-data-row-gutter'>
						<h2 className='c-form-data-title'>Name</h2>
						<input
							className='c-form-textinput'
							style={{ border: errorName ? errorStyle : '' }}
							type='text'
                            placeholder='E.g: Wall-E'
							onChange={(event: ChangeEvent<HTMLInputElement>) => {
								getDataName(event);
							}}
						></input>
						<p
							className='c-error-text'
							style={{ display: errorName ? 'block' : 'none' }}
						>
							Name must be filled in.
						</p>
					</div>

					<div className='c-form-data-row-gutter'>
						<h2 className='c-form-data-title'>Ip</h2>
						<input
							className='c-form-textinput'
							style={{ border: errorIp ? errorStyle : '' }}
							type='text'
                            placeholder='E.g: 192.168.1.1'
							onChange={(event: ChangeEvent<HTMLInputElement>) => {
								getDataIp(event);
							}}
						></input>
						<p
							className='c-error-text'
							style={{ display: errorIp ? 'block' : 'none' }}
						>
							Ip must be filled in.
						</p>
					</div>
				</section>

                <section className='c-form-data-gutter'>
                    <h2 className='c-form-data-title'>Photo</h2>
                    <input className='c-form-file'
                        type='file' 
                        accept='.jpg'
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
								getDataPicture(event);
							}}
                    />
                </section>  

				<section className='c-form-data-gutter'>
					<h2 className='c-form-data-title'>Description</h2>
					<textarea
						className='c-form-textarea'
						style={{ border: errorDesc ? errorStyle : '' }}
                        placeholder='E.g: This is a humanoid robot'
						onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
							getDataDesc(event);
						}}
					/>
					<p
						className='c-error-text'
						style={{ display: errorDesc ? 'block' : 'none' }}
					>
						Description must be filled in.
					</p>
				</section>

                <section className='c-form-data-gutter'>
					<h2 className='c-form-data-title'>Extra info (json)</h2>
					<textarea
						className='c-form-textarea'
						style={{ border: errorExtra ? errorStyle : '' }}
                        placeholder='E.g: {"key":"text","key":number}'
						onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
							getDataExtra(event);
						}}
					/>
					<p
						className='c-error-text'
						style={{ display: errorExtra ? 'block' : 'none' }}
					>
						Extra info must be filled in.
					</p>
						<p
						className='c-error-text'
						style={{ display: errorJson ? 'block' : 'none' }}
					>
						Payload must be JSON format.
					</p>
				</section>
			</article>
		</section>
	);
}
