import { getLoginToken } from "./localStorage";

const withRetry = async (requestFn, retriesLeft = 3) => {
	const res = await requestFn();
	if (res.status === 200 || res.status === 201) {
		return res.json();
	} else if (res.status == 400) {
		const error = {
			status: 400,
			message: "La richiesta non comprende tutti i campi richiesti",
		};
		throw error;
	} else if (res.status === 401) {
		if (retriesLeft > 0) {
			return withRetry(requestFn, retriesLeft - 1);
		}
		const error = {
			status: 401,
			message: "Non sei autorizzato a compiere questa azione",
		};
		throw error;
	} else if (res.status === 404) {
		const error = {
			status: 404,
			message: "Risorsa non trovata",
		};
		throw error;
	} else if (res.status === 409) {
		const error = {
			status: 409,
			message: "Hai già creato una playlist con lo stesso titolo",
		};
		throw error;
	} else if (res.status === 500) {
		if (retriesLeft > 0) {
			return withRetry(requestFn, retriesLeft - 1);
		}
		const error = {
			status: 500,
			message: "Errore interno del server",
		};
		throw error;
	}
};

const makeAuthenticatedGetRequest = async (url) => {
	return await withRetry(async () => {
		return await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}${url}`, {
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${getLoginToken()}`,
			},
		});
	});
};

const makeAuthenticatedPostRequest = async (url, body) => {
	return await withRetry(async () => {
		return await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}${url}`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${getLoginToken()}`,
			},
		});
	});
};

const makeAuthenticatedPutRequest = async (url, body) => {
	return await withRetry(async () => {
		return await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}${url}`, {
			method: "PUT",
			body: JSON.stringify(body),
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${getLoginToken()}`,
			},
		});
	});
};

const makeAuthenticatedPatchRequest = async (url, body) => {
	return await withRetry(async () => {
		return await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}${url}`, {
			method: "PATCH",
			body: JSON.stringify(body),
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${getLoginToken()}`,
			},
		});
	});
};

const makeAuthenticatedDeleteRequest = async (url) => {
	return await withRetry(async () => {
		return await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}${url}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${getLoginToken()}`,
			},
		});
	});
};

export {
	makeAuthenticatedGetRequest,
	makeAuthenticatedPostRequest,
	makeAuthenticatedPatchRequest,
	makeAuthenticatedPutRequest,
	makeAuthenticatedDeleteRequest,
};
