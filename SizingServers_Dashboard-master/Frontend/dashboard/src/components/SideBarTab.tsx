import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RobotInterface from '../models/RobotInterface';
import { activeMovementsContext } from '../store/activeMovements';

export default function SideBarTab({
	tabId,
	robot,
	selectedRobot,
}: {
	tabId: string;
	robot: RobotInterface;
	selectedRobot: string;
}) {
	const [robotHasActiveMovement, setRobotHasActiveMovement] =
		useState<boolean>(false);

	const { activeMovements } = useContext(activeMovementsContext);

	const checkRobotbHasActiveMovements = () => {
		if (robot.name in activeMovements) {
			if (
				//@ts-ignore
				selectedRobot !== robot.uuid
			) {
				setRobotHasActiveMovement(true);
			} else {
				setRobotHasActiveMovement(false);
			}
		} else {
			setRobotHasActiveMovement(false);
		}
	};

	useEffect(() => {
		checkRobotbHasActiveMovements();
	}, [activeMovements, selectedRobot]);

	return (
		<Link
			to={`/${tabId}`}
			className={`c-sidebar-nav__item ${
				selectedRobot === tabId && 'is-active'
			}`}
		>
			<div className='c-sidebar-nav__info'>
				<svg
					className='c-sidebar-nav__icon'
					xmlns='http://www.w3.org/2000/svg'
					width='19.974'
					height='23.973'
					viewBox='0 0 19.974 23.973'
				>
					<g transform='translate(0 10.091)'>
						<g transform='translate(7.684 9.411)'>
							<path
								d='M254.949,440.192l-.863.442c-.028-.242.354-1.874,1.717-1.874,1.293,0,1.787,1.478,1.787,1.7l-.866-.382-.241.614-.535,1.607Z'
								transform='translate(-253.775 -437.832)'
								fill='#fff'
							/>
							<path
								d='M251.752,422.45l-2.66.091c-.249,0-.6-.195-.613-.459h0l3.852-.131h0C252.341,422.213,251.958,422.45,251.752,422.45Z'
								transform='translate(-248.48 -421.95)'
								fill='#fff'
							/>
						</g>
						<path
							d='M123.257,288.377c-1.18.586-2.518,1.884-2.657,2.738a.074.074,0,0,0,.026.068,1.783,1.783,0,0,1,.317,1.813l-.007.014a.432.432,0,0,1-.3.2.39.39,0,0,1-.173-.019.217.217,0,0,1-.074-.042.279.279,0,0,1-.123-.283l.06-.193a.924.924,0,0,0,.03-.11,1,1,0,0,0-.118-.715.843.843,0,0,0-.136-.166l-.007-.006a.762.762,0,0,0-.6-.131.75.75,0,0,0-.546.533.428.428,0,0,1-.461.3.3.3,0,0,1-.081-.033.315.315,0,0,1-.147-.284,1.15,1.15,0,0,1,.14-.518,1.532,1.532,0,0,1,1.486-.708.052.052,0,0,0,.055-.032c.346-.863,1.245-2.344,4.183-3.55a8.058,8.058,0,0,0-.565.61,1.883,1.883,0,0,0-.3.516'
							transform='translate(-118.261 -285.274)'
							fill='#fff'
						/>
						<path
							d='M336.852,253.569a7.219,7.219,0,0,0,3.967-.183c.13-.049.257-.1.378-.157a.09.09,0,0,0,.051-.092,1.731,1.731,0,0,1,.221-1.1,1.682,1.682,0,0,1,.524-.545l.014-.007a.431.431,0,0,1,.356.009.39.39,0,0,1,.13.11.229.229,0,0,1,.038.079.28.28,0,0,1-.062.3l-.16.124a1.017,1.017,0,0,0-.088.074,1,1,0,0,0-.314.654.838.838,0,0,0,.018.211.06.06,0,0,0,0,.009.761.761,0,0,0,.418.452.749.749,0,0,0,.755-.12.427.427,0,0,1,.549.018.279.279,0,0,1,.047.073.313.313,0,0,1-.044.319,1.155,1.155,0,0,1-.412.345,1.509,1.509,0,0,1-1.592-.315.088.088,0,0,0-.094-.013,6.747,6.747,0,0,1-1.979.569,7.267,7.267,0,0,1-2.1-.055,3.377,3.377,0,0,0-.253-.368c-.134-.166-.3-.32-.363-.394'
							transform='translate(-323.743 -251.454)'
							fill='#fff'
						/>
						<g transform='translate(5.417 0.576)'>
							<path
								d='M.981,8.65H.975a.849.849,0,0,1-.89-.88L0,4.608A4.812,4.812,0,0,1,.159,3.3,3.707,3.707,0,0,1,3.067.6V0L4.434.074v.47a3.94,3.94,0,0,1,3.53,3.721L8.07,7.533a.819.819,0,0,1-.226.589.878.878,0,0,1-.618.275ZM2.675,3.206h0L2.4,5.91h.7l.112-1.5L3.87,5.855H4.2l.538-1.594L4.993,5.8h.713L5.189,3.106H4.471L4.008,4.475l-.02.072-.6-1.334Z'
								fill='#fff'
							/>
						</g>
					</g>
					<g transform='translate(1.812 0)'>
						<g transform='translate(0 5.495)'>
							<path
								d='M151.946,167.065a.893.893,0,0,1,.086-1.784'
								transform='translate(-151.096 -165.281)'
								fill='#fff'
							/>
							<path
								d='M389.75,183.372a.907.907,0,0,0,.075-1.812'
								transform='translate(-376.576 -180.661)'
								fill='#fff'
							/>
						</g>
						<path
							d='M10.581,7.739l-.057,0L.842,7.1A.925.925,0,0,1,0,6.1L.338.884A.928.928,0,0,1,1.245,0H1.3l9.683.642a.925.925,0,0,1,.84,1l-.336,5.211A.931.931,0,0,1,10.581,7.739ZM7.265,5.774l-.023.369.363.023L7.628,5.8l-.364-.024Zm-.875-.058-.023.369.363.024.024-.369-.364-.024Zm-.876-.057-.023.368.363.024.023-.368-.363-.024ZM4.638,5.6l-.023.368.363.024L5,5.625,4.638,5.6Zm-.875-.058-.023.368.363.024.024-.368-.364-.024ZM2.7,1.624A1.145,1.145,0,0,0,1.561,2.7l-.008.128A1.154,1.154,0,0,0,2.614,4.061l6.439.425.071,0A1.14,1.14,0,0,0,9.882,4.2a1.153,1.153,0,0,0,.382-.79l.008-.128A1.152,1.152,0,0,0,9.21,2.054L2.772,1.626Z'
							transform='translate(1.129 2.974)'
							fill='#fff'
						/>
						<g transform='translate(3.444)'>
							<g transform='translate(6.162 0.441)'>
								<path
									d='M325.966,75.547h0a.891.891,0,0,1-.85-.931l.006-.081a.889.889,0,0,1,.962-.811h0a.893.893,0,0,1,.85.931l-.006.081A.889.889,0,0,1,325.966,75.547Z'
									transform='translate(-325.114 -73.722)'
									fill='#fff'
								/>
								<path
									d='M336.977,104.5l-.407-.018-.04.97.407.018Z'
									transform='translate(-335.9 -102.782)'
									fill='#fff'
								/>
							</g>
							<path
								d='M214.326,67.567h0a.892.892,0,0,1-.846-.931l0-.081a.888.888,0,0,1,.96-.811h0a.892.892,0,0,1,.846.931l0,.081a.887.887,0,0,1-.96.811Z'
								transform='translate(-213.478 -65.741)'
								fill='#fff'
							/>
							<path
								d='M225.341,86.718l-.407-.018-.064,1.512.407.018Z'
								transform='translate(-224.241 -85.543)'
								fill='#fff'
							/>
						</g>
						<g transform='translate(7.102 4.289)'>
							<path
								d='M297.3,147.076l-.936-.417,1.4-3.218.936.417Z'
								transform='translate(-295.444 -143.44)'
								fill='#fff'
							/>
							<path
								d='M280.14,147l-.38-.169,1.393-3.219.38.169Z'
								transform='translate(-279.76 -143.601)'
								fill='#fff'
							/>
						</g>
					</g>
				</svg>
				<p className='c-sidebar-nav__text'>{robot.name}</p>
			</div>

			{robotHasActiveMovement && (
				<span className='c-active-indicator c-sidebar-nav__active-indicator'></span>
			)}
		</Link>
	);
}
