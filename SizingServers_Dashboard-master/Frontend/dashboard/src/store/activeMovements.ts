import { createContext } from 'react';

interface ActiveMovementsStore {
	activeMovements: Object;
	setActiveMovements: Function;
}

export const activeMovementsContext = createContext<ActiveMovementsStore>({
	activeMovements: [],
	setActiveMovements: () => {},
});
