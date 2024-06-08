"use client";

import { useEffect, useState } from "react";
import SidebarLayout from "../../../components/SidebarLayout";
import {
	makeAuthenticatedGetRequest,
	makeAuthenticatedPutRequest,
} from "../../../utils/RestUtils";
import { PlayIcon } from "@heroicons/react/24/outline";

import convertToMinutes from "../../../utils/Time";

import Link from "next/link";
import { HeartIconFilled } from "../../../components/HeartIcon";
import { Toast, ToastType } from "../../../components/Toast";

export default function LikedSongs() {
	const [likedSongs, setLikedSongs] = useState([]);

	const [toastText, setToastText] = useState("");
	const [toastType, setToastType] = useState(ToastType.ERROR);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await makeAuthenticatedGetRequest("/users/likedSongs");
				setLikedSongs(result.likedSongs);
			} catch (error) {
				setToastText(error.message);
			}
		};
		fetchData();
	}, []);

	const removeFromLikedSongs = async (song) => {
		try {
			await makeAuthenticatedPutRequest("/users/likedSongs", {
				id: song.id,
				name: song.name,
				artists: song.artists,
				external_urls: song.external_urls,
				image: song.image,
				explicit: song.explicit,
				duration_ms: song.duration_ms,
			});

			const newLikedSongs = likedSongs.filter((s) => s.id !== song.id);
			setLikedSongs(newLikedSongs);
			setToastText("Canzone rimossa dai preferiti");
			setToastType(ToastType.SUCCESS);
		} catch (error) {
			setToastText(error.message);
			setToastType(ToastType.ERROR);
		}
	};

	return (
		<SidebarLayout>
			<div className='mx-auto max-w-[1200px]'>
				<h1 className='text-4xl font-bold mt-4 py-10'>Canzoni preferite</h1>
				<div className='w-full grid grid-cols-1 py-4 px-2 space-y-4'>
					{likedSongs && likedSongs.length > 0 ? (
						likedSongs.map((song) => (
							<div
								key={song.id}
								className='w-full flex flex-row items-center justify-evenly py-2 px-2 bg-black rounded-lg'
							>
								<HeartIconFilled
									className='w-max h-6 w-6 stroke-2 text-gray-400 cursor-pointer transition-colors duration-300 hover:text-gray-200'
									onClick={() => {
										removeFromLikedSongs(song);
									}}
								/>
								<img
									src={song.image}
									alt={song.name}
									width={50}
									height={50}
									className='basis-1/12'
								/>
								<div className='flex flex-col basis-3/6'>
									<span className='text-lg font-bold'>
										{song.name}{" "}
										{song.explicit && (
											<span className='ml-2 text-sm font-semibold bg-white bg-opacity-20 rounded-lg p-2'>
												Explicit
											</span>
										)}
									</span>
									<span className='text-gray-400'>
										{song.artists.map((artist) => artist.name).join(", ")}
									</span>
								</div>
								<p>{song.album}</p>
								<Link href={song.external_urls}>
									<PlayIcon className='h-6 w-6 basis-1/12' />
								</Link>
								<p className='basis-1/12'>
									{convertToMinutes(song.duration_ms)}
								</p>
							</div>
						))
					) : (
						<p className='text-lg text-gray-400'>
							Non hai ancora nessuna canzone tra i preferiti
						</p>
					)}
				</div>
				{toastText && (
					<Toast
						label={toastText}
						type={toastType}
						onClose={() => setToastText("")}
					/>
				)}
			</div>
		</SidebarLayout>
	);
}
