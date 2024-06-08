"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { handleLogin } from "../../utils/Auth";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [errorLoginLabel, setErrorLoginLabel] = useState("");

	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await handleLogin(email, password);
		if (result.error) {
			setErrorLoginLabel(result.message);
		} else {
			router.push("/");
		}
	};

	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24 bg-[#1d1d1d]'>
			<form onSubmit={handleSubmit} className='w-[400px]'>
				<h1 className='text-[#1ed760] font-bold text-4xl'>
					Social Network for Music
				</h1>
				<h3 className='text-white font-medium text-3xl mt-6'>
					Effettua l'accesso per utilizzare il servizio
				</h3>
				<div className='text-white flex flex-col mt-4'>
					<label htmlFor='email' className='text-xl'>
						Email
					</label>
					<input
						type='email'
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
						}}
						className='border-2 bg-transparent border-[#1ed760] py-1.5 px-2 mt-2 rounded-md outline-none'
					/>
				</div>
				<input
					type='submit'
					value={"Effettua accesso"}
					className='w-full bg-[#1ed760] hover:bg-[#06cc4d] mt-6 rounded-xl py-2 font-medium cursor-pointer'
				/>
				{errorLoginLabel && <p className='text-red-600'>{errorLoginLabel}</p>}
				<hr className='h-px my-8 bg-gray-200 border-0 dark:bg-gray-700' />
				<p className='text-white text-center'>
					Non hai un account?{" "}
					<span>
						<Link
							className='text-[#1ed760] border-b-2 border-[#1ed760]'
							href={"/register"}
						>
							Registrati
						</Link>
					</span>
				</p>
			</form>
		</main>
	);
}
