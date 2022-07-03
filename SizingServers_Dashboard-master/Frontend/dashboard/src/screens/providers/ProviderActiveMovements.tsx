import { useState } from 'react';
import { activeMovementsContext } from '../../store/activeMovements';

const ProviderActiveMovements = (props: any) => {
	const [activeMovements, setActiveMovements] = useState<Object>({});

	return (
		<activeMovementsContext.Provider
			value={{ activeMovements, setActiveMovements }}
		>
			{props.children}
		</activeMovementsContext.Provider>
	);
};

export default ProviderActiveMovements;
