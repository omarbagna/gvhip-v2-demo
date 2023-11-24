import { createContext, useContext, useState } from 'react';

const Context = createContext();

export const StateContext = ({ children }) => {
	const [viewTraveller, setViewTraveller] = useState(false);
	const [viewTravellerData, setViewTravellerData] = useState(null);
	const [viewUser, setViewUser] = useState(false);
	const [viewUserData, setViewUserData] = useState(null);

	return (
		<Context.Provider
			value={{
				viewTraveller,
				setViewTraveller,
				viewTravellerData,
				setViewTravellerData,
				viewUser,
				setViewUser,
				viewUserData,
				setViewUserData,
			}}>
			{children}
		</Context.Provider>
	);
};

export const useStateContext = () => useContext(Context);
