import DonutChart from '../components/DonutChart';
import ComponentLogInterface from '../models/ComponentLogInterface';

export default function LogsCard({logs}:{logs:ComponentLogInterface[]}) {

	return (
		<section className='c-logs-heat'>
			<article className='c-logs-heat-container'>
				<h1 className='c-logs-heat-container__title'>Heat</h1>

				<div className='c-logs-heat-data-grid'>
					{logs.map((h: ComponentLogInterface) => (
						<DonutChart key={h.uuid} componentLog={h} />
					))}
				</div>
			</article>
		</section>
	);
}
