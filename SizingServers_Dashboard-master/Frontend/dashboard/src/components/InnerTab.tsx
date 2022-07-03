import { Link } from 'react-router-dom';

import { setFirstLetterUpper } from '../utils/stringFunctions';

export default function InnerTab({
	tabId,
	name,
	url,
	selectedTab,
}: {
	tabId: string;
	name: string;
	url: string;
	selectedTab: string;
}) {

	return (
		<Link
			className={`c-inner-nav__button ${selectedTab === tabId && 'is-active'}`}
			to={`${url}/${tabId}`}
		>
			{setFirstLetterUpper(name)}
		</Link>
	);
}
