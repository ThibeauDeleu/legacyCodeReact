import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import ComponentLogInterface from '../models/ComponentLogInterface';
import DetailLogs from './DetailLogs';
import HeatLogsCard from './HeatLogsCard';

export default function ControlDetailScreen({
	logs,
	getInnerTab,
}: {
	logs: ComponentLogInterface[];
	getInnerTab: Function;
}) {

	// ! Page data
	const [allLogs, setAllLogs] = useState<ComponentLogInterface[]>([])
	const [group, setGroup] = useState<string>('');
	const [tempLogs, setTempLogs] = useState<ComponentLogInterface[]>([])
	const [alertLogs, setAlertLogs] = useState<ComponentLogInterface[]>([])

	const location = useLocation();
	
	useEffect(() => {
		setAllLogs(logs)
		let heat:ComponentLogInterface[] = [];
		let alert:ComponentLogInterface[] = [];
		
		//@ts-ignore
		if (allLogs[group]){
			//@ts-ignore
			heat = allLogs[group].filter((t: ComponentLogInterface) =>
				t.type.toLowerCase() === 'temperature'
			)
			setTempLogs(heat);

			//@ts-ignore
			alert = allLogs[group].filter((t: ComponentLogInterface) =>
				t.type.toLowerCase() === 'alert'
			)
			setAlertLogs(alert);
		}
	},[group])


	useEffect(() => {
		const [robotId, screeId, groupname] = location.pathname
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
				allLogs[group] && 
					<HeatLogsCard logs={tempLogs}/>
			}
			{
				// @ts-ignore
				allLogs[group] &&
					<DetailLogs logs={alertLogs}/>
			}
		</section>
	);
}