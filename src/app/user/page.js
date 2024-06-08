"use client";

import { useState, useEffect } from "react";

import {
	makeAuthenticatedPostRequest,
	makeAuthenticatedPutRequest,
	makeAuthenticatedDeleteRequest,
	makeAuthenticatedGetRequest,
} from "../../utils/RestUtils";
import SidebarLayout from "../../components/SidebarLayout";
import { Toast, ToastType } from "../../components/Toast";

const GeneralInfo = ({ user, setUser, setToastText, setToastType }) => {
	const handleChange = (e) => {
		const { name, value } = e.target;
		setUser({
			...user,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (user.username && user.email) {
			try {
				await makeAuthenticatedPutRequest("/users/update", {
					username: user.username,
					email: user.email,
				});

				setToastText("Dati dell'utente aggiornati con successo");
				setToastType(ToastType.SUCCESS);
			} catch (error) {
				setToastText(
					"C'e' stato un errore durante l'aggiornamento delle informazioni",
				);
				setToastType(ToastType.ERROR);
			}
		}
	};

	return (
		<div className='grid w-full grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
			<div>
				<h2 className='text-base font-semibold leading-7 text-white'>
					Informazioni personali
				</h2>
				<p className='mt-1 text-sm leading-6 text-gray-400'>
					Aggiorna le tue informazioni personali. Queste informazioni verranno
					visualizzate sul tuo profilo.
				</p>
			</div>

			<form className='md:col-span-2 max-w-xl' onSubmit={handleSubmit}>
				<div className='mt-4'>
					<label htmlFor='username' className='text-sm text-white'>
						Nome
					</label>
					<input
						type='text'
						name='username'
						id='username'
						autoComplete='given-name'
						className='block w-full rounded-md  bg-white/5 py-1.5 px-2 text-white shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6'
						value={user.username}
						onChange={handleChange}
					/>
				</div>
				<div className='mt-4'>
					<label htmlFor='email' className='text-sm text-white'>
						Email
					</label>
					<input
						type='email'
						name='email'
						id='email'
						autoComplete='email'
						className='block w-full rounded-md  bg-white/5 py-1.5 px-2 text-white shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6'
						value={user.email}
						onChange={handleChange}
					/>
				</div>

				<div className='mt-8 flex'>
					<button
						type='submit'
						className='rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500'
					>
						Salva
					</button>
				</div>
			</form>
		</div>
	);
};

const PasswordChange = ({ setToastText, setToastType }) => {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmationPassword, setConfirmationPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (newPassword !== confirmationPassword) return;
		if (currentPassword && newPassword && confirmationPassword) {
			try {
				await makeAuthenticatedPostRequest("/users/update-password", {
					oldPassword: currentPassword,
					newPassword: newPassword,
					confirmationPassword: confirmationPassword,
				});

				setToastText("Password aggiornata con successo");
				setToastType(ToastType.SUCCESS);
			} catch (error) {
				setToastText(
					"C'e' stato un errore durante l'aggiornamento delle informazioni",
				);
				setToastType(ToastType.ERROR);
			}
		}
	};

	return (
		<div className='grid w-full grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
			<div>
				<h2 className='text-base font-semibold leading-7 text-white'>
					Cambia la tua password
				</h2>
				<p className='mt-1 text-sm leading-6 text-gray-400'>
					Aggiorna la password associata a questo account.
				</p>
			</div>

			<form className='md:col-span-2' onSubmit={handleSubmit}>
				<div className='grid grid-cols-1 gap-x-6 gap-y-8 max-w-xl'>
					<div className='col-span-full'>
						<label
							htmlFor='current-password'
							className='block text-sm font-medium leading-6 text-white'
						>
							Password corrente
						</label>
						<div className='mt-2'>
							<input
								id='current-password'
								name='current_password'
								type='password'
								autoComplete='current-password'
								className='block w-full rounded-md  bg-white/5 py-1.5 px-2 text-white shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6'
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
							/>
						</div>
					</div>

					<div className='col-span-full'>
						<label
							htmlFor='new-password'
							className='block text-sm font-medium leading-6 text-white'
						>
							Nuova password
						</label>
						<div className='mt-2'>
							<input
								id='new-password'
								name='new_password'
								type='password'
								autoComplete='new-password'
								className='block w-full rounded-md  bg-white/5 py-1.5 px-2 text-white shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6'
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
					</div>

					<div className='col-span-full'>
						<label
							htmlFor='confirm-password'
							className='block text-sm font-medium leading-6 text-white'
						>
							Conferma password
						</label>
						<div className='mt-2'>
							<input
								id='confirm-password'
								name='confirm_password'
								type='password'
								autoComplete='new-password'
								className='block w-full rounded-md  bg-white/5 py-1.5 px-2 text-white shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6'
								value={confirmationPassword}
								onChange={(e) => setConfirmationPassword(e.target.value)}
							/>
						</div>
					</div>
					{newPassword.length > 0 &&
						confirmationPassword.length > 0 &&
						newPassword !== confirmationPassword && (
							<p className='text-red-600 mt-2 w-full'>
								La password di conferma non può essere diversa dalla password
								inserita.
							</p>
						)}
				</div>

				<div className='mt-8 flex'>
					<button
						type='submit'
						className='rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500'
					>
						Salva
					</button>
				</div>
			</form>
		</div>
	);
};

const GenreSelection = ({ user, setToastText, setToastType }) => {
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

	const [likedGenres, setLikedGenres] = useState(user.likedGenres);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (likedGenres) {
			try {
				await makeAuthenticatedPutRequest("/users/likedGenres", {
					likedGenres: likedGenres,
				});

				setToastText("Generi aggiornati con successo");
				setToastType(ToastType.SUCCESS);
			} catch (error) {
				setToastText(
					"C'e' stato un errore durante l'aggiornamento delle informazioni",
				);
				setToastType(ToastType.ERROR);
			}
		}
	};

	return (
		<div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
			<div>
				<h2 className='text-base font-semibold leading-7 text-white'>
					Preferenze musicali
				</h2>
				<p className='mt-1 text-sm leading-6 text-gray-400'>
					Aggiorna le tue preferenze musicali. Queste informazioni ci aiutano a
					farti scoprire nuovi contenuti. Seleziona i generi che ti piacciono di
					più.
				</p>
			</div>
			<div className='form-group grid grid-cols-2 gap-4 w-full md:grid-cols-3 lg:px-8  md:col-span-2'>
				{genresList.map((genre, index) => (
					<label
						key={index}
						className='flex items-center text-white justify-between w-full bg-white/5 p-2 rounded-md'
					>
						<span className='font-semibold capitalize'>{genre}</span>
						<input
							type='checkbox'
							name='genre'
							checked={likedGenres && likedGenres.includes(genre)}
							className='form-radio h-5 w-5 text-blue-500 ml-2'
							onChange={(e) => {
								if (e.target.checked) {
									setLikedGenres([...likedGenres, genre]);
								} else {
									setLikedGenres(likedGenres.filter((g) => g !== genre));
								}
							}}
						/>
					</label>
				))}
				<div className='mt-8 flex'>
					<button
						type='submit'
						className='rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500'
						onClick={handleSubmit}
					>
						Salva
					</button>
				</div>
			</div>
		</div>
	);
};

const DeleteAccount = () => {
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await makeAuthenticatedDeleteRequest("/users/delete");
			alert("Account eliminato con successo");
			window.location.href = "/login";
		} catch (error) {
			console.error(error);
			alert("C'e' stato un errore durante l'eliminazione dell'account");
		}
	};

	return (
		<div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8'>
			<div>
				<h2 className='text-base font-semibold leading-7 text-white'>
					Cancella account
				</h2>
				<p className='mt-1 text-sm leading-6 text-gray-400'>
					Non vuoi più utilizzare il nostro servizio? Puoi eliminare il tuo
					account qui. Questa azione non è reversibile. Tutte le informazioni
					relative a questo account verranno eliminate definitivamente.
				</p>
			</div>

			<form className='flex items-start md:col-span-2' onSubmit={handleSubmit}>
				<button
					type='submit'
					className='rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400'
				>
					Confermo di voler cancellare l'account
				</button>
			</form>
		</div>
	);
};

export default function User() {
	const [user, setUser] = useState(null);

	const [toastText, setToastText] = useState("");
	const [toastType, setToastType] = useState(ToastType.SUCCESS);

	useEffect(() => {
		const fetchData = async () => {
			const result = await makeAuthenticatedGetRequest("/users/me");
			if (result.status === 401) {
				window.location.href = "/login";
			}

			setUser(result.user);
		};
		fetchData();
	}, []);

	return (
		<SidebarLayout>
			<main className='flex min-h-screen flex-col items-center justify-between bg-[#1d1d1d]'>
				{user && (
					<div className='flex flex-col justify-start max-w-[1200px]'>
						<GeneralInfo
							user={user}
							setUser={setUser}
							setToastText={setToastText}
							setToastType={setToastType}
						/>
						<PasswordChange
							setToastText={setToastText}
							setToastType={setToastType}
						/>
						<GenreSelection
							user={user}
							setToastText={setToastText}
							setToastType={setToastType}
						/>
						<DeleteAccount />
					</div>
				)}
				{toastText && (
					<Toast
						label={toastText}
						type={toastType}
						onClose={() => setToastText("")}
					/>
				)}
			</main>
		</SidebarLayout>
	);
}
