"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SidebarLayout from "../../../components/SidebarLayout";
import { makeAuthenticatedGetRequest } from "../../../utils/RestUtils";
import { Toast, ToastType } from "../../../components/Toast";

export default function ViewUser() {
	const router = useRouter();
	const params = useParams();

	const [user, setUser] = useState(undefined);
	const [publicPlaylists, setPublicPlaylists] = useState([]);
	const [errorLabel, setErrorLabel] = useState("");

	const [toastText, setToastText] = useState("");
	const [toastType, setToastType] = useState(ToastType.SUCCESS);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await makeAuthenticatedGetRequest(
					`/users/${params.userId}`,
				);
				setUser(result.user);
			} catch (error) {
				setErrorLabel("Utente non trovato");
			}
		};
		const fetchPublicPlaylists = async () => {
			try {
				const response = await makeAuthenticatedGetRequest(
					`/playlists/public/user/${params.userId}`,
				);
				setPublicPlaylists(response.playlists);
			} catch (error) {
				setToastText(error.message);
				setToastType(ToastType.ERROR);
			}
		};
		fetchData();
		fetchPublicPlaylists();
	}, []);

	return (
		<SidebarLayout>
			<div className='mx-auto max-w-[1200px]'>
				{errorLabel ? (
					<p className='text-red-600 text-lg'>{errorLabel}</p>
				) : (
					user && (
						<div>
							<h1 className='text-4xl font-bold mt-4 py-10'>Profilo utente</h1>
							<div className='space-y-20'>
								<div>
									<h2 className='text-2xl font-semibold'>
										Informazioni utente
									</h2>
									<div className='flex flex-col gap-4 mt-4'>
										<div className='flex flex-row space-x-2'>
											<label className='text-white font-medium'>
												Username:
											</label>
											<span className='text-white'>{user.username}</span>
										</div>
									</div>
								</div>
								<div>
									<h2 className='text-2xl font-bold'>Playlist pubbliche</h2>
									<div className='flex flex-col gap-4 mt-4'>
										{publicPlaylists.map((playlist, index) => (
											<div
												className='flex flex-row justify-between items-center bg-[#000000] rounded-lg w-full relative py-4 px-4 cursor-pointer hover:bg-[#1F1F1F]'
												key={index}
												onClick={() =>
													router.push(`/playlists/${playlist._id}`)
												}
											>
												<div className='flex flex-col space-y-2'>
													<p className='font-semibold text-lg'>
														{playlist.title}
													</p>
													<p className='text-gray-300'>
														{playlist.description}
													</p>
													<p className='text-gray-300'>
														Followers: {playlist.followers.length}
													</p>
													<p className='text-gray-300'>
														Canzoni: {playlist.tracks.length}
													</p>
												</div>
												<div className='flex flex-row space-x-4 h-max'>
													{playlist.tags.map((tag, index) => (
														<div
															className='flex flex-row items-center gap-x-2 mt-2 w-max bg-white p-2 rounded-full'
															key={index}
														>
															<p className='text-black font-normal text-sm'>
																{tag}
															</p>
														</div>
													))}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
							{toastText && (
								<Toast
									label={toastText}
									toastType={toastType}
									onClose={setToastText("")}
								/>
							)}
						</div>
					)
				)}
			</div>
		</SidebarLayout>
	);
}
