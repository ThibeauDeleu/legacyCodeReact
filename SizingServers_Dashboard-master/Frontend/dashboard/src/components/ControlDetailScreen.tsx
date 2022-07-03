import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import ComponentInterface from '../models/ComponentInterface';
import Control from './Control';

export default function ControlDetailScreen({
	controls,
	getInnerTab,
}: {
	controls: ComponentInterface[];
	getInnerTab: Function;
}) {
	const [group, setGroup] = useState<string>('');

	const location = useLocation();

	useEffect(() => {
		const [robotId, screenId, groupname] = location.pathname
			.substring(1)
			.split('/');
		// @ts-ignore
		setGroup(groupname);
		getInnerTab(groupname);
	}, [location]);

	return (
		<section>
			{
				// @ts-ignore
				controls[group] &&
					// @ts-ignore
					controls[group].map((control: ComponentInterface) => {
						return <Control key={control.uuid} component={control} />;
					})
			}
		</section>
	);
}
