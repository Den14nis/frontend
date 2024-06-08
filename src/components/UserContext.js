"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
	getUserData,
	addUserData,
	removeUserData,
} from "../utils/localStorage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const storedUser = getUserData();
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const saveUserDataToStorage = (userData) => {
		setUser(userData);
		addUserData(JSON.stringify(userData));
	};

	const deleteUserDataFromStorage = () => {
		setUser(null);
		removeUserData();
	};

	return (
		<UserContext.Provider
			value={{ user, saveUserDataToStorage, deleteUserDataFromStorage }}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	return useContext(UserContext);
};
