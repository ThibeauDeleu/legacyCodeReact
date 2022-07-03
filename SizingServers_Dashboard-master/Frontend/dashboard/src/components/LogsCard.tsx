import ActivityLog from '../components/ActivityLog';
import MovementLogInterface from '../models/MovementLogInterface';


export default function LogsCard({logs}:{logs:MovementLogInterface[]}){
    return(
        <aside className='c-logs'>
            <h1 className='c-logs__title'>Activity</h1>

            {logs.map((l: MovementLogInterface) => (
				<ActivityLog key={l.uuid} log={l}/>
			))}
        </aside> 
    )
}