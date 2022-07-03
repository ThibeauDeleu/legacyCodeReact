import RobotInterface from "../models/RobotInterface";

export default function ConnectionCard({robotGeg}:{robotGeg:RobotInterface}){
    return (
			<article className='c-status-connection'>
				<h1 className='c-status-connection__title u-mb--md'>Connection</h1>
				<div className='c-status-connection__data'>
					<div>
						<p className='u-mb--xs u-text__normal--bold'>IP</p>
						<p className='c-status-connection__text'>{robotGeg.ip}</p>
					</div>
				</div>
			</article>
		);
}