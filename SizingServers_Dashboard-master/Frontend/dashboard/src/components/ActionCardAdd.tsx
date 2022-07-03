import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

export default function ActionCard({ type }: { type: string }) {

	const location = useLocation();
	const [uri, setUri] = useState<string>();

	useEffect(() => {
		splitUrl();
	},[])

	const splitUrl = () => {
		const robotId = location.pathname.substring(1).split('/')[0];
		const Atype = location.pathname.substring(2).split('/')[1];

		setUri(`/${robotId}/addaction/${Atype}`)
	}

	return (
		<Link className='c-movement c-movement__add'
			to={`${uri}`}
		>
			<svg
				className='c-movement__add-icon u-mb--sm'
				id='add_circle_black_24dp'
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 48 48'
			>
				<path d='M0,0H48V48H0Z' fill='none' />
				<path
					d='M20.15,2A18.15,18.15,0,1,0,38.3,20.15,18.157,18.157,0,0,0,20.15,2Zm9.075,19.965h-7.26v7.26h-3.63v-7.26h-7.26v-3.63h7.26v-7.26h3.63v7.26h7.26Z'
					transform='translate(3.85 3.85)'
				/>
			</svg>
			<p>{`Add ${type}`}</p>
		</Link>
		
	);
}
