import { url } from 'inspector';
import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import ActionCard from '../components/MovementCard';
import MessageBar from '../components/MessageBar';
import MovementInterface from '../models/MovementInterface'
import API from '../utils/api';

export default function EditMovementScreen() {

	const errorStyle = '1px solid var(--global-color-red-500)';

	const location = useLocation();
	let history = useHistory();
	const [messageBalk, setMessageBar] = useState<boolean>(false);
	const [messageBarType, setMessageBarType] = useState<string>('error');
	const [message, setMessage] = useState<string>('Could not update movement');

	const [errorMovement, setErrorMovement] = useState<boolean>(false);
	const [errorName, setErrorName] = useState<boolean>(false);
	const [errorDesc, setErrorDesc] = useState<boolean>(false);
	const [errorcomp, setErrorComp] = useState<boolean>(false);

	const [dataMovement, setDataMovement] = useState<string>('Sequence');
	const [dataName, setDataName] = useState<string>('');
	const [dataDesc, setDataDesc] = useState<string>('');
	const [datacomp, setDataComp] = useState<string>();
	const [movementData, setMovementData] = useState<MovementInterface>();


	useEffect(() => {
		const movementId = location.pathname.substring(1).split('/')[2];
		if(movementId != null){
			GetmovementData(movementId);
		}
	}, []);

	const GetmovementData = async(movementId:string) => {
		try{
			let movementInfo: MovementInterface = await API.get(
				`movement/id/${movementId}`
			);
			setMovementData(movementInfo);
			if(movementInfo){
				setDataMovement(movementInfo.movement_type);
				setDataName(movementInfo.name);
				setDataDesc(movementInfo.description);
			}
		}catch(error){
			console.log(error)
		}
	}

	const checkInputs = () => {
		setMessageBarType('error');
		setMessage('Could not update movement');

		if (dataName === '' || dataDesc === '') {
			setMessageBar(true);
		} else {
			setMessageBar(false);
		}

		if(dataName === '') setErrorName(true);
		else setErrorName(false);
		if(dataDesc === '') setErrorDesc(true);
		else setErrorDesc(false);

		if (dataName !== '' && dataDesc !== '') {
			setErrorName(false);
			setErrorDesc(false);

			setMessageBar(false);
			updateData()
		} 
	};

	const updateData = async () => {
		try{
			const body ={
				uuid: movementData!.uuid,
				name: dataName,
				description: dataDesc,
				in_development: movementData!.in_development
			}
			const response: MovementInterface = await API.put('movement',body);
			setMessageBar(true)
			setMessageBarType('succes')
			setMessage('Movement update succesfull')
			setTimeout(() => {
					history.goBack();
			}, 1500);
		}catch(error){
			console.log(error);
			setMessageBar(true)
			setMessageBarType('error')
			setMessage('Movement update failed')
		}
	}

	const deleteMovement = async() => {
		try{
			const body = movementData!.uuid
			const response: MovementInterface = await API.delete('movement', body)
			setMessageBar(true)
			setMessageBarType('succes')
			setMessage('Movement deleted succesfully')
			setTimeout(() => {
					history.goBack();
			}, 1500);
		}catch(error){
			console.log(error);
			setMessageBar(true)
			setMessageBarType('error')
			setMessage('Movement delete failed')
		}
	}

	const getDataMovement = (event: ChangeEvent<HTMLSelectElement>) => {
		setDataMovement(event.target.value);
	};

	const getDataName = (event: ChangeEvent<HTMLInputElement>) => {
		setDataName(event.target.value);
	};

	const getDataDesc = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setDataDesc(event.target.value);
	};

	return (
		<section className='c-app__data-item--padding'>
			<article className='c-form'>
				<MessageBar
					message={`${message}`}
					type={`${messageBarType}`}
					showMessageBar={messageBalk}
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
						<h1 className='c-form-header-title'>Edit movement </h1>
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
						<h2 className='c-form-data-title'>Movement type</h2>
						<span className='c-custom-select'>
							<select
								style={{ border: errorMovement ? errorStyle : '' }}
								name='movement'
								id='movement'
								value={dataMovement}
								onChange={(event: ChangeEvent<HTMLSelectElement>) => {
									getDataMovement(event);
								}}
								className='c-form-dropdown c-custom-select__input'
							>
								<option value='Control'>Control</option>
								<option value='Demo'>Demo</option>
								<option value='Sequence'>Sequence</option>
							</select>

							<svg
								className='c-custom-select__symbol'
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
							>
								<path
									id='Path_55'
									data-name='Path 55'
									d='M0,0H24V24H0Z'
									fill='none'
								/>
								<path
									id='Path_56'
									data-name='Path 56'
									d='M16.59,8.59,12,13.17,7.41,8.59,6,10l6,6,6-6Z'
								/>
							</svg>
						</span>
						<p
							className='c-error-text'
							style={{ display: errorMovement ? 'block' : 'none' }}
						>
							You must select a movement type.
						</p>
					</div>

					<div className='c-form-data-row-gutter'>
						<h2 className='c-form-data-title'>Name</h2>
						<input
							className='c-form-textinput'
							style={{ border: errorName ? errorStyle : '' }}
							type='text'
							value={dataName}
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
				</section>

				<section className='c-form-data-gutter'>
					<h2 className='c-form-data-title'>Description</h2>
					<textarea
						value={dataDesc}
						className='c-form-textarea'
						style={{ border: errorDesc ? errorStyle : '' }}
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
					<h2 className='c-form-data-title'>Components needed</h2>
					<span className='c-custom-select'>
							<select
								className='c-form-dropdown c-custom-select__input'
								name='select1'
								id='select1'
							>
								<option value='component1'>component 1</option>
								<option value='component2'>component 2</option>
								<option value='component3'>component 3</option>
								<option value='component4'>component 4</option>
							</select>

							<svg
								className='c-custom-select__symbol'
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
							>
								<path
									id='Path_55'
									data-name='Path 55'
									d='M0,0H24V24H0Z'
									fill='none'
								/>
								<path
									id='Path_56'
									data-name='Path 56'
									d='M16.59,8.59,12,13.17,7.41,8.59,6,10l6,6,6-6Z'
								/>
							</svg>
						</span>

					<div className='c-form-data-gutter'>
						<div className='c-form-data-checkbox__container'>
							<div className='c-form-data-block'>
								<input
									className='c-form-option c-form-option--hidden o-hide-accessible'
									type='checkbox'
									id='Servo'
								/>
								<label
									className='c-form-label c-custom-option'
									htmlFor='Servo'
								>
									<span
										className='
											c-custom-option__fake-input
											c-custom-option__fake-input--checkbox'
									>
										<svg
											className='c-custom-option__symbol'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 9 6.75'
										>
											<path
												d='M4.75,9.5a1,1,0,0,1-.707-.293l-2.25-2.25A1,1,0,1,1,3.207,5.543L4.75,7.086,8.793,3.043a1,1,0,0,1,1.414,1.414l-4.75,4.75A1,1,0,0,1,4.75,9.5'
												transform='translate(-1.5 -2.75)'
											/>
										</svg>
									</span>
									Servo motor
								</label>
							</div>

							<div className='c-form-data-block'>
								<input
									className='c-form-option c-form-option--hidden o-hide-accessible'
									type='checkbox'
									id='Fan'
								/>
								<label
									className='c-form-label c-custom-option'
									htmlFor='Fan'
								>
									<span
										className='
											c-custom-option__fake-input
											c-custom-option__fake-input--checkbox'
									>
										<svg
											className='c-custom-option__symbol'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 9 6.75'
										>
											<path
												d='M4.75,9.5a1,1,0,0,1-.707-.293l-2.25-2.25A1,1,0,1,1,3.207,5.543L4.75,7.086,8.793,3.043a1,1,0,0,1,1.414,1.414l-4.75,4.75A1,1,0,0,1,4.75,9.5'
												transform='translate(-1.5 -2.75)'
											/>
										</svg>
									</span>
										Fan
								</label>
							</div>
						</div>

						<div className='c-form-data-checkbox__container'>
							<div className='c-form-data-block'>
								<input
									className='c-form-option c-form-option--hidden o-hide-accessible'
									type='checkbox'
									id='temp'
								/>
								<label
									className='c-form-label c-custom-option'
									htmlFor='temp'
								>
									<span
										className='
											c-custom-option__fake-input
											c-custom-option__fake-input--checkbox'
									>
										<svg
											className='c-custom-option__symbol'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 9 6.75'
										>
											<path
												d='M4.75,9.5a1,1,0,0,1-.707-.293l-2.25-2.25A1,1,0,1,1,3.207,5.543L4.75,7.086,8.793,3.043a1,1,0,0,1,1.414,1.414l-4.75,4.75A1,1,0,0,1,4.75,9.5'
												transform='translate(-1.5 -2.75)'
											/>
										</svg>
									</span>
									temp sensor
								</label>
							</div>

							<div className='c-form-data-block'>
								<input
									className='c-form-option c-form-option--hidden o-hide-accessible'
									type='checkbox'
									id='rotary'
								/>
								<label
									className='c-form-label c-custom-option'
									htmlFor='rotary'
								>
									<span
										className='
											c-custom-option__fake-input
											c-custom-option__fake-input--checkbox'
									>
										<svg
											className='c-custom-option__symbol'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 9 6.75'
										>
											<path
												d='M4.75,9.5a1,1,0,0,1-.707-.293l-2.25-2.25A1,1,0,1,1,3.207,5.543L4.75,7.086,8.793,3.043a1,1,0,0,1,1.414,1.414l-4.75,4.75A1,1,0,0,1,4.75,9.5'
												transform='translate(-1.5 -2.75)'
											/>
										</svg>
									</span>
										Rotary
								</label>
							</div>
						</div>
					</div>
				</section>
				<section className='c-dangerzone'>
					<h2 className='c-addA-data-title'>Danger zone</h2>
					<article className='c-dangerzone-container'>
						<p>Delete this movement</p>
						<button className='c-form-button delete-button'
							onClick={() => deleteMovement()}
						>
							<p>Delete</p>
						</button>
					</article>
				</section>
			</article>
		</section>
	);
}
