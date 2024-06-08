import axios from "axios";

import { addLoginToken } from "./localStorage";

export const handleRegister = async (
	username,
	email,
	password,
	confirmationPassword,
	likedGenres,
) => {
	try {
		const response = await axios.post(
			"http://localhost:4000/api/auth/register",
			{
				username: username,
				email: email,
				password: password,
				confirmationPassword: confirmationPassword,
				likedGenres,
			},
		);

		return {
			error: false,
			message: "Registrazione avvenuta con successo",
		};
	} catch (err) {
		return {
			error: true,
			message: "Errore nella registrazione, riprova più tardi",
		};
	}
};

export const handleLogin = async (email, password) => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
			{
				email: email,
				password: password,
			},
		);
		if (response.data.status == 200) {
			addLoginToken(response.data.token);
			return {
				error: false,
				message: "Login avvenuto con successo",
			};
		}
	} catch (err) {
		return {
			error: true,
			message: "Email o password errati",
		};
	}
};
