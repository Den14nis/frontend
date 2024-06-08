const tokenKey = "x-auth-token";
const userDataKey = "user-data";

const setItem = (key, value) => {
	localStorage.setItem(key, value);
};

const getItem = (key) => {
	return localStorage.getItem(key);
};

const removeItem = (key) => {
	localStorage.removeItem(key);
};

const addLoginToken = (value) => {
	setItem(tokenKey, value);
};

const removeLoginToken = () => {
	removeItem(tokenKey);
};

const getLoginToken = () => {
	return getItem(tokenKey);
};

const addUserData = (value) => {
	return setItem(userDataKey, value);
};

const getUserData = () => {
	return getItem(userDataKey);
};

const removeUserData = () => {
	removeItem(userDataKey);
};

export {
	addLoginToken,
	removeLoginToken,
	getLoginToken,
	addUserData,
	getUserData,
	removeUserData,
};
