"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

import { handleRegister } from "../../utils/Auth";

const GenreSelection = ({ likedGenres, setLikedGenres }) => {
	const genresList = [
		"rap",
		"classic",
		"rock",
		"trap",
		"pop",
		"hip-hop",
		"country",
		"metal",
		"funk",
		"electronic",
		"disco",
		"techno",
	];

	const handleGenreSelection = (genre) => {
		if (likedGenres.includes(genre)) {
			setLikedGenres(likedGenres.filter((g) => g !== genre));
		} else {
			setLikedGenres([...likedGenres, genre]);
		}
	};

	return (
		<div className='flex flex-col mt-4'>
			<label className='text-white text-xl'>Generi musicali preferiti</label>
			<div className='flex flex-wrap gap-2 mt-2'>
				{genresList.map((genre) => (
					<span
						key={genre}
						onClick={() => handleGenreSelection(genre)}
						className={`${
							likedGenres.includes(genre)
								? "bg-[#1ed760] text-black"
								: "bg-transparent text-white"
						} px-4 py-2 rounded-md border-2 border-[#1ed760] cursor-pointer`}
					>
						{genre}
					</span>
				))}
			</div>
		</div>
	);
};

export default function Register() {
	const router = useRouter();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmationPassword, setConfirmationPassword] = useState("");
	const [likedGenres, setLikedGenres] = useState([]);

	const [errorPassword, setErrorPassword] = useState("");
	const [errorConfirmationPassword, setErrorConfirmationPassword] =
		useState("");

	const [errorRegisterLabel, setErrorRegisterLabel] = useState("");

	const checkPasswordValidity = (password) => {
		if (password.length < 8 && errorPassword === "") {
			setErrorPassword("La password deve avere minimo 8 caratteri");
		} else if (password.length == 8 && errorPassword !== "") {
			setErrorPassword("");
		}
	};

	const comparePassword = (confirmationPassword) => {
		if (password !== confirmationPassword && errorConfirmationPassword === "") {
			setErrorConfirmationPassword("Le password devono essere uguali");
		} else if (
			password === confirmationPassword &&
			errorConfirmationPassword !== ""
		)
			setErrorConfirmationPassword("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await handleRegister(
			username,
			email,
			password,
			confirmationPassword,
			likedGenres,
		);

		if (result.error) {
			setErrorRegisterLabel(result.message);
		} else {
			window.alert(result.message);
			router.push("/login");
		}
	};

	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24 bg-[#1d1d1d]'>
			<form onSubmit={handleSubmit} className='w-[400px]'>
				<h1 className='text-[#1ed760] font-bold text-4xl'>
					Social Network for Music
				</h1>
				<h3 className='text-white font-medium text-3xl mt-6'>
					Iscriviti per utilizzare il servizio
				</h3>
				<div className='text-white flex flex-col mt-4'>
					<label htmlFor='username' className='text-xl'>
						Username
					</label>
					<input
						type='text'
						name='username'
						id='username'
						autoComplete='username'
						placeholder={username ? username : "example1234"}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						className='border-2 bg-transparent border-[#1ed760] py-1.5 px-2 mt-2 rounded-md outline-none'
					/>
				</div>
				<div className='text-white flex flex-col mt-4'>
					<label htmlFor='email' className='text-xl'>
						Email
					</label>
					<input
						type='text'
						name='email'
						id='email'
						autoComplete='email'
						placeholder={email ? email : "nome@dominio.com"}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						className='border-2 bg-transparent border-[#1ed760] py-1.5 px-2 mt-2 rounded-md outline-none'
					/>
				</div>
				<div className='text-white flex flex-col mt-4'>
					<label htmlFor='password' className='text-xl'>
						Password
					</label>
					<input
						type='password'
						name='password'
						id='password'
						autoComplete='password'
						placeholder={password ? password : "password1234"}
						onChange={(e) => {
							setPassword(e.target.value);
							checkPasswordValidity(e.target.value);
						}}
						className='border-2 bg-transparent border-[#1ed760] py-1.5 px-2 mt-2 rounded-md outline-none'
					/>
					<p className='text-red-600'>{errorPassword}</p>
				</div>
				<div className='text-white flex flex-col mt-4'>
					<label htmlFor='confirmationPassword' className='text-xl'>
						Conferma password
					</label>
					<input
						type='password'
						name='confirmationPassword'
						id='confirmationPassword'
						autoComplete='password'
						placeholder={
							confirmationPassword ? confirmationPassword : "password1234"
						}
						onChange={(e) => {
							setConfirmationPassword(e.target.value);
							comparePassword(e.target.value);
						}}
						className='border-2 bg-transparent border-[#1ed760] py-1.5 px-2 mt-2 rounded-md outline-none'
					/>
					<p className='text-red-600'>{errorConfirmationPassword}</p>
				</div>
				<GenreSelection
					likedGenres={likedGenres}
					setLikedGenres={setLikedGenres}
				/>
				<input
					type='submit'
					value={"Registrati"}
					className='w-full bg-[#1ed760] hover:bg-[#06cc4d] mt-6 rounded-xl py-2 font-medium cursor-pointer'
				/>
				{errorRegisterLabel && (
					<p className='text-red-600'>{errorRegisterLabel}</p>
				)}
				<hr className='h-px my-8 bg-gray-200 border-0 dark:bg-gray-700' />
				<p className='text-white text-center'>
					Hai già un'account?{" "}
					<span>
						<Link
							className='text-[#1ed760] border-b-2 border-[#1ed760]'
							href={"/login"}
						>
							Accedi
						</Link>
					</span>
				</p>
			</form>
		</main>
	);
}
