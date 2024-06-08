"use client";

import { HeartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { makeAuthenticatedGetRequest } from "../../utils/RestUtils";
import SidebarLayout from "../../components/SidebarLayout";
import { Toast, ToastType } from "../../components/Toast";
import { handleToggleLikedSong } from "../../utils/SongUtils";
import {
	handleGetLikedArtistsForUser,
	handleToggleLikedArtist,
} from "../../utils/ArtistUtils";
import { HeartIconFilled } from "../../components/HeartIcon";
import { useRouter } from "next/navigation";

import { handleGetLikedSongsForUser } from "../../utils/SongUtils";

const SearchType = {
	TRACK: "track",
	ALBUM: "album",
	ARTIST: "artist",
	PLAYLIST: "playlist",
	USERS: "user",
};

function truncateText(text) {
	if (text.length > 30) {
		return text.substring(0, 30) + "...";
	} else {
		return text;
	}
}

const SearchLayout = ({ result, selectedSearchTag }) => {
	const router = useRouter();

	return (
		<div className='grid grid-cols-1 gap-y-2 w-full mt-10'>
			{selectedSearchTag === SearchType.PLAYLIST
				? result.map((playlist, index) => (
						<div
							className='flex flex-row justify-between items-center bg-[#000000] rounded-lg w-full relative py-4 px-4 cursor-pointer hover:bg-[#1F1F1F]'
							key={index}
							onClick={() => router.push(`/playlists/${playlist._id}`)}
						>
							<div className='flex flex-col space-y-2'>
								<p className='font-semibold text-lg'>{playlist.title}</p>
								<p className='text-gray-300'>{playlist.description}</p>
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
										<p className='text-black font-normal text-sm'>{tag}</p>
									</div>
								))}
							</div>
						</div>
				  ))
				: result.map((user, index) => {
						return (
							<div
								className='flex bg-[#000000] rounded-lg w-full relative py-4 px-4 cursor-pointer hover:bg-[#1F1F1F]'
								key={index}
								onClick={() => router.push(`/user/${user._id}`)}
							>
								<div className='flex flex-col'>
									<p className='font-semibold text-lg'>{user.username}</p>
									<div className='flex flex-row space-x-2 items-center'>
										{user.likedGenres.map((tag, index) => (
											<div
												className='flex flex-row items-center gap-x-2 mt-2 w-max bg-white p-2 rounded-full'
												key={index}
											>
												<p className='text-black font-normal text-sm'>{tag}</p>
											</div>
										))}
									</div>
								</div>
							</div>
						);
				  })}
		</div>
	);
};

export default function Search() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedSearchTag, setSelectedSearchTag] = useState(SearchType.TRACK);
	const [responseElements, setResponseElements] = useState([]);

	const [currentLiked, setCurrentLiked] = useState([]);

	const [toastText, setToastText] = useState("");
	const [toastType, setToastType] = useState(ToastType.SUCCESS);

	const makeSearchRequest = async () => {
		if (!searchQuery) {
			return;
		}
		try {
			if (selectedSearchTag === SearchType.PLAYLIST) {
				try {
					const res = await makeAuthenticatedGetRequest(
						`/playlists/search?title=${searchQuery}`,
					);
					setResponseElements(res.playlists);
				} catch (error) {
					setToastText(error.message);
					setToastType(ToastType.ERROR);
				}
			} else if (selectedSearchTag === SearchType.USERS) {
				try {
					const res = await makeAuthenticatedGetRequest(
						`/users/search?username=${searchQuery}`,
					);
					setResponseElements(res.users);
				} catch (error) {
					setToastText(error.message);
					setToastType(ToastType.ERROR);
				}
			} else {
				const res = await makeAuthenticatedGetRequest(
					`/spotify/search?type=${selectedSearchTag}&q=${searchQuery}`,
				);

				if (SearchType.TRACK === selectedSearchTag) {
					setResponseElements(res.message.tracks.items);
				} else if (SearchType.ALBUM === selectedSearchTag) {
					setResponseElements(res.message.albums.items);
				} else if (SearchType.ARTIST === selectedSearchTag) {
					setResponseElements(res.message.artists.items);
				}
			}
		} catch (error) {
			setToastText(error.message);
			setToastType(ToastType.ERROR);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		makeSearchRequest();
	};

	const handleLike = async (element) => {
		if (!element) {
			return;
		}
		if (selectedSearchTag === SearchType.TRACK) {
			try {
				const songToAdd = {
					id: element.id,
					name: element.name,
					artists: element.artists,
					external_urls: element.external_urls,
					image: element.album.images[0].url,
					explicit: element.explicit,
					duration_ms: element.duration_ms,
				};
				const addedSong = await handleToggleLikedSong(songToAdd);
				if (currentLiked.includes(addedSong.id)) {
					setCurrentLiked(currentLiked.filter((id) => id !== addedSong.id));
					setToastText("Canzone rimossa dai preferiti");
				} else {
					setCurrentLiked([...currentLiked, addedSong.id]);
					setToastText("Canzone aggiunta ai preferiti");
				}
			} catch (error) {
				setToastText(error.message);
				setToastType(ToastType.ERROR);
			}
		} else if (selectedSearchTag === SearchType.ARTIST) {
			const artistToAdd = {
				id: element.id,
				name: element.name,
				external_urls: element.external_urls,
				image: element.images[0].url,
			};

			const addedArtist = await handleToggleLikedArtist(artistToAdd);
			if (currentLiked.includes(addedArtist.id)) {
				setCurrentLiked(currentLiked.filter((id) => id !== addedArtist.id));
				setToastText("Artista rimosso dai preferiti");
			} else {
				setCurrentLiked([...currentLiked, addedArtist.id]);
				setToastText("Artista aggiunto ai preferiti");
			}
		}
	};

	const addCurrentLiked = async () => {
		if (selectedSearchTag === SearchType.TRACK) {
			setCurrentLiked(await handleGetLikedSongsForUser(responseElements));
		} else if (selectedSearchTag === SearchType.ARTIST) {
			setCurrentLiked(await handleGetLikedArtistsForUser(responseElements));
		}
	};

	useEffect(() => {
		if (
			(responseElements.length > 0 && selectedSearchTag === SearchType.TRACK) ||
			selectedSearchTag === SearchType.ARTIST
		) {
			addCurrentLiked();
		}
	}, [responseElements]);

	return (
		<SidebarLayout>
			<div className='py-6 px-4'>
				<form className='max-w-sm' onSubmit={handleSubmit}>
					<label htmlFor='simple-search' className='sr-only'>
						Search
					</label>
					<div className='relative w-full'>
						<div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
							<MagnifyingGlassIcon className='w-6 h-6 text-white' />
						</div>
						<input
							type='text'
							id='simple-search'
							className='bg-black border border-black rounded-full text-white text-sm block w-full ps-10 p-2.5'
							placeholder='Scrivi le parole da ricercare...'
							onChange={(e) => {
								setSearchQuery(e.target.value);
							}}
							value={searchQuery}
							required
						/>
					</div>
					<div className='flex flex-row gap-x-2 mt-6'>
						{Object.keys(SearchType).map((key) => (
							<div key={key}>
								<span
									className={`capitalize text-sm rounded-full px-4 py-2 cursor-pointer hover:bg-white hover:text-black ${
										selectedSearchTag === SearchType[key]
											? "bg-white text-black"
											: "bg-black text-white "
									}`}
									onClick={() => {
										setSelectedSearchTag(SearchType[key]);
										setResponseElements([]);
										setSearchQuery("");
										setCurrentLiked([]);
									}}
								>
									{SearchType[key]}
								</span>
							</div>
						))}
					</div>
				</form>
				{(responseElements.length > 0 &&
					selectedSearchTag === SearchType.PLAYLIST) ||
				selectedSearchTag === SearchType.USERS ? (
					<SearchLayout
						result={responseElements}
						selectedSearchTag={selectedSearchTag}
					/>
				) : (
					<div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center mt-4 w-full'>
						{responseElements.map((responseElement, index) => (
							<div
								className='bg-[#000000] rounded-lg h-[300px] w-full relative'
								key={index}
							>
								<a href={responseElement.external_urls.spotify} target='_blank'>
									{selectedSearchTag === SearchType.TRACK && (
										<img
											src={responseElement.album.images[0].url}
											alt='album_cover'
											className='w-full h-[200px] object-contain rounded-t-lg'
										/>
									)}
									{(selectedSearchTag === SearchType.ALBUM ||
										selectedSearchTag === SearchType.ARTIST) && (
										<img
											src={responseElement.images[0].url}
											alt='album_cover'
											className='w-full h-[200px] object-contain rounded-t-lg'
										/>
									)}
								</a>
								<div className=' mt-4 px-2 flex flex-row justify-between'>
									<div>
										<h3 className='font-bold text-sm'>
											{truncateText(responseElement.name)}
										</h3>
										<h5 className='font-medium text-sm mt-2'>
											{selectedSearchTag !== SearchType.ARTIST &&
											selectedSearchTag !== SearchType.PLAYLIST
												? responseElement.artists[0].name
												: responseElement.name}
										</h5>
									</div>
									{selectedSearchTag === SearchType.TRACK ||
									selectedSearchTag === SearchType.ARTIST ? (
										currentLiked.includes(responseElement.id) ? (
											<HeartIconFilled
												className='h-6 w-6 text-gray-300 hover:text-white cursor-pointer'
												onClick={() => handleLike(responseElement)}
											/>
										) : (
											<HeartIcon
												className='h-6 w-6 text-gray-300 hover:text-white cursor-pointer'
												onClick={() => handleLike(responseElement)}
											/>
										)
									) : (
										""
									)}
								</div>
							</div>
						))}
					</div>
				)}
				{toastText !== "" && (
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
