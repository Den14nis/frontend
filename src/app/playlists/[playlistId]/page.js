"use client";

import { useParams } from "next/navigation";
import {
	makeAuthenticatedDeleteRequest,
	makeAuthenticatedGetRequest,
	makeAuthenticatedPatchRequest,
	makeAuthenticatedPostRequest,
	makeAuthenticatedPutRequest,
} from "../../../utils/RestUtils";
import { useEffect, useState } from "react";
import SidebarLayout from "../../../components/SidebarLayout";
import {
	ExclamationTriangleIcon,
	LockClosedIcon,
	LockOpenIcon,
	PencilIcon,
	PlayIcon,
	PlusIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon, HeartIconFilled } from "../../../components/HeartIcon";
import SwitchToggle from "../../../components/SwitchToggle";
import { useUser } from "../../../components/UserContext";
import convertToMinutes from "../../../utils/Time";
import Link from "next/link";
import { Toast, ToastType } from "../../../components/Toast";
import {
	handleGetLikedSongsForUser,
	handleToggleLikedSong,
} from "../../../utils/SongUtils";

const SearchSong = ({ playlist, setPlaylist, setToastText, setToastType }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [responseElements, setResponseElements] = useState([]);

	const searchSong = async (e) => {
		e.preventDefault();
		try {
			const res = await makeAuthenticatedGetRequest(
				`/spotify/search?type=track&q=${searchQuery}&limit=4`,
			);
			setResponseElements(res.message.tracks.items);
		} catch (error) {
			setToastText(error.message);
			setToastType(ToastType.ERROR);
		}
	};

	const truncateText = (text) => {
		if (text.length > 30) {
			return text.substring(0, 30) + "...";
		} else {
			return text;
		}
	};

	const handleAddTrack = async (track) => {
		const tracks = playlist.tracks;
		tracks.push(track);
		await makeAuthenticatedPatchRequest(`/playlists/${playlist._id}`, {
			tracks: tracks,
		});
		setPlaylist((prevPlaylist) => ({
			...prevPlaylist,
			tracks: tracks,
		}));
	};

	const handleTrackDelete = async (track) => {
		const tracks = playlist.tracks.filter((t) => t.id !== track.id);
		await makeAuthenticatedPatchRequest(`/playlists/${playlist._id}`, {
			tracks: tracks,
		});
		setPlaylist((prevPlaylist) => ({
			...prevPlaylist,
			tracks: tracks,
		}));
	};

	return (
		<div className='mt-10'>
			<div className='relative w-full flex flex-row items-center space-x-2 mt-4'>
				<input
					type='text'
					id='simple-search'
					className='bg-black border border-black rounded-lg text-white text-sm block w-full p-2.5'
					placeholder='Cerca una canzone da aggiungere'
					onChange={(e) => {
						setSearchQuery(e.target.value);
						if (e.target.value === "") {
							setResponseElements([]);
						}
					}}
					value={searchQuery}
				/>
				<div>
					<button
						className='bg-[#1ed760] text-white py-2 px-2 rounded-lg cursor-pointer hover:bg-[#06cc4d]'
						onClick={(e) => {
							if (searchQuery !== "") {
								searchSong(e);
							}
						}}
					>
						Cerca
					</button>
				</div>
			</div>
			<div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center mt-4'>
				{responseElements.map((responseElement, index) => (
					<div
						className='bg-[#000000] rounded-lg h-[300px] w-full relative'
						key={index}
					>
						<a href={responseElement.external_urls[0]} target='_blank'>
							<img
								src={responseElement.album.images[0].url}
								alt='album_cover'
								className='w-full h-[200px] object-contain rounded-t-lg'
							/>
						</a>
						<div className=' mt-4 px-2 flex flex-row justify-between'>
							<div>
								<h3 className='font-bold text-sm'>
									{truncateText(responseElement.name)}
								</h3>
								<h5 className='font-medium text-sm mt-2'>
									{responseElement.artists
										.map((artist) => artist.name)
										.join(", ")}
								</h5>
							</div>
							{playlist.tracks.some(
								(track) => track.id === responseElement.id,
							) ? (
								<XMarkIcon
									className='h-6 w-6 text-gray-300 hover:text-white cursor-pointer'
									onClick={() => {
										handleTrackDelete({
											id: responseElement.id,
											name: responseElement.name,
											artists: responseElement.artists,
											external_urls: responseElement.external_urls,
											image: responseElement.album.images[0].url,
											explicit: responseElement.explicit,
											duration_ms: responseElement.duration_ms,
										});
									}}
								/>
							) : (
								<PlusIcon
									className='h-6 w-6 text-gray-300 hover:text-white cursor-pointer'
									onClick={() => {
										handleAddTrack({
											id: responseElement.id,
											name: responseElement.name,
											artists: responseElement.artists,
											external_urls: responseElement.external_urls,
											image: responseElement.album.images[0].url,
											explicit: responseElement.explicit,
											duration_ms: responseElement.duration_ms,
										});
									}}
								/>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const DeleteModal = ({ playlistId, setShowDeleteModal }) => {
	const handleDelete = async () => {
		const result = await makeAuthenticatedDeleteRequest(
			`/playlists/${playlistId}`,
		);
		if (result && result.error) {
			setErrorLabel(result.message);
		} else {
			window.location.href = "/";
		}
	};

	return (
		<div className='h-screen w-screen z-50 bg-black bg-opacity-50 fixed top-0 left-0 flex justify-center items-center'>
			<div
				id='popup-modal'
				tabIndex='-1'
				className='bg-transparent text-white overflow-y-auto overflow-x-hidden justify-center items-center w-max p-4 md:p-5 text-center'
			>
				<div className='relative p-4 w-full max-w-md max-h-full'>
					<div className='relative bg-gray-800 rounded-lg shadow'>
						<XMarkIcon
							className='cursor-pointer absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center'
							onClick={() => setShowDeleteModal(false)}
						/>
						<div className='p-4 md:p-5 text-center'>
							<ExclamationTriangleIcon className='mx-auto mb-4 text-white w-12 h-12' />
							<h3 className='mb-5 text-lg font-normal text-white'>
								Sei sicuro di voler eliminare questa playlist?
							</h3>
							<button
								data-modal-hide='popup-modal'
								type='button'
								className='text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center'
								onClick={handleDelete}
							>
								Elimina
							</button>
							<button
								data-modal-hide='popup-modal'
								type='button'
								className='py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
								onClick={() => setShowDeleteModal(false)}
							>
								Annulla
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const UpdatePlaylistModal = ({ playlist, setShowUpdateModal }) => {
	const [title, setTitle] = useState(playlist.title);
	const [description, setDescription] = useState(playlist.description);
	const [tags, setTags] = useState(playlist.tags);
	const [temporaryTag, setTemporaryTag] = useState("");
	const [isPublic, setIsPublic] = useState(playlist.isPublic);

	const handleUpdate = async (e) => {
		e.preventDefault();
		try {
			await makeAuthenticatedPutRequest(`/playlists/${playlist._id}`, {
				title: title,
				description: description,
				tags: tags,
				isPublic: isPublic,
			});
			window.location.reload();
		} catch (error) {
			setErrorLabel(error.message);
		}
	};

	return (
		<div className='h-screen w-screen z-50 bg-black bg-opacity-50 fixed top-0 left-0 flex justify-center items-center'>
			<div
				id='popup-modal'
				tabindex='-1'
				className='bg-transparent text-white overflow-y-auto overflow-x-hidden justify-center items-center w-max p-4 md:p-5 text-center'
			>
				<form
					className='grid grid-cols-1 gap-y-4 bg-gray-800 rounded-lg shadow md:w-[680px] p-4 text-left'
					onSubmit={handleUpdate}
				>
					<div className='relative p-4 w-full'>
						<XMarkIcon
							className='cursor-pointer absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center'
							onClick={() => setShowUpdateModal(false)}
						/>
					</div>
					<div className='flex flex-col space-y-2'>
						<label htmlFor='title' className='text-lg'>
							Titolo
						</label>
						<input
							type='text'
							name='title'
							id='title'
							required
							onChange={(e) => {
								setTitle(e.target.value);
							}}
							className='bg-black focus:border-[#1ed760] py-1.5 px-2 rounded-md outline-none'
							value={title}
						/>
					</div>
					<div className='flex flex-col space-y-2'>
						<label htmlFor='description' className='text-lg'>
							Descrizione
						</label>
						<textarea
							type='text'
							name='description'
							id='description'
							required
							rows={6}
							onChange={(e) => {
								setDescription(e.target.value);
							}}
							value={description}
							className='bg-black focus:border-[#1ed760] py-1.5 px-2 rounded-md outline-none'
						/>
					</div>
					<div className='flex flex-col mt-4 space-y-4'>
						<label htmlFor='title' className='text-lg'>
							Tags
						</label>
						<div className='flex flex-row items-center gap-x-2 mt-2 w-full'>
							<input
								type='text'
								name='temporaryTag'
								id='temporaryTag'
								onChange={(e) => {
									setTemporaryTag(e.target.value);
								}}
								value={temporaryTag}
								className='bg-black focus:border-[#1ed760] py-1.5 px-2 rounded-md outline-none'
							/>
							<span
								className='bg-[#1ed760] py-1.5 px-4 rounded-lg cursor-pointer hover:bg-[#06cc4d]'
								onClick={() => {
									if (temporaryTag !== "" && !tags.includes(temporaryTag)) {
										setTags([...tags, temporaryTag]);
										setTemporaryTag("");
									}
								}}
							>
								Aggiungi
							</span>
						</div>
						<div className='flex flex-row items-center mt-2 space-x-2'>
							{tags.map((tag, index) => (
								<div
									className='bg-gray-100 text-black cursor-pointer hover:bg-gray-300 inline-flex items-center px-4 py-1 cursor-pointer rounded-full'
									key={index}
								>
									<span className='text-lg font-medium text-black'>{tag}</span>
									<XMarkIcon
										className='h-6 w-6 text-black hover:text-red-600 cursor-pointer'
										onClick={() => {
											setTags(tags.filter((t) => t !== tag));
										}}
									/>
								</div>
							))}
						</div>
					</div>
					<div className='text-white flex flex-row items-center mt-4 space-x-4'>
						<label htmlFor='isPublic' className='text-lg'>
							Playlist pubblica?
						</label>
						<SwitchToggle
							label='Pubblica'
							checked={isPublic}
							onChange={() => setIsPublic(!isPublic)}
						/>
					</div>
					<input
						type='submit'
						className='bg-[#1ed760] text-white py-2 px-2 rounded-lg cursor-pointer hover:bg-[#06cc4d]'
						value='Aggiorna'
					/>
				</form>
			</div>
		</div>
	);
};

export default function ViewPlaylist() {
	const { user } = useUser();

	const params = useParams();
	const [playlist, setPlaylist] = useState(undefined);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState([]);
	const [errorLabel, setErrorLabel] = useState();

	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [toastText, setToastText] = useState("");
	const [toastType, setToastType] = useState(ToastType.SUCCESS);

	const [currentLiked, setCurrentLiked] = useState([]);

	const handleTrackDelete = async (track) => {
		const tracks = playlist.tracks.filter((t) => t.id !== track.id);
		await makeAuthenticatedPatchRequest(`/playlists/${params.playlistId}`, {
			tracks: tracks,
		});
		setPlaylist((prevPlaylist) => ({
			...prevPlaylist,
			tracks: tracks,
		}));
	};

	const handleToggleLikeSong = async (song) => {
		try {
			await handleToggleLikedSong(song);
			if (currentLiked.includes(song.id)) {
				setCurrentLiked(currentLiked.filter((id) => id !== song.id));
				setToastText("Canzone rimossa dai preferiti");
				setToastType(ToastType.SUCCESS);
			} else {
				setCurrentLiked([...currentLiked, song.id]);
				setToastText("Canzone aggiunta ai preferiti");
				setToastType(ToastType.SUCCESS);
			}
		} catch (error) {
			setToastText(error.message);
			setToastType(ToastType.ERROR);
		}
	};

	const handleToggleFollowPlaylist = async () => {
		try {
			await makeAuthenticatedPostRequest(
				`/playlists/${playlist._id}/like `,
				{},
			);
			setPlaylist((prevPlaylist) => {
				const followers = [...prevPlaylist.followers];

				const userIndex = followers.findIndex(
					(follower) => follower.userId === user._id,
				);

				if (userIndex !== -1) {
					const updatedFollowers = followers.filter(
						(follower) => follower.userId !== user._id,
					);
					setToastText("Hai smesso di seguire questa playlist");
					return { ...prevPlaylist, followers: updatedFollowers };
				} else {
					const updatedFollowers = [
						...followers,
						{
							userId: user._id,
							isCreator: false,
							isFollow: true,
						},
					];
					setToastText("Hai iniziato a seguire questa playlist");
					return { ...prevPlaylist, followers: updatedFollowers };
				}
			});
		} catch (error) {
			setToastText(error.message);
			setToastType(ToastType.ERROR);
		}
	};

	const isPlaylistCreator = () => {
		return user && playlist && user._id === playlist.creator;
	};

	const isFollowingPlaylist = () => {
		return (
			user &&
			playlist &&
			playlist.followers.some((follower) => follower.userId === user._id)
		);
	};

	const addCurrentLiked = async () => {
		setCurrentLiked(await handleGetLikedSongsForUser(playlist.tracks));
	};

	useEffect(() => {
		const fetchData = async () => {
			const playlistId = params.playlistId;
			try {
				const result = await makeAuthenticatedGetRequest(
					`/playlists/${playlistId}`,
				);
				setPlaylist(result.playlist);
				setTitle(result.playlist.title);
				setDescription(result.playlist.description);
				setTags(result.playlist.tags);
			} catch (error) {
				setToastText(error.message);
				setToastType(ToastType.ERROR);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (playlist && playlist.tracks) {
			addCurrentLiked();
		}
	}, [playlist]);

	return (
		<SidebarLayout>
			{errorLabel
				? errorLabel
				: playlist && (
						<div className='mx-auto max-w-[1200px] py-10'>
							<div className='flex flex-row items-center justify-between'>
								<div className='flex flex-row items-center space-x-4'>
									<h3 className='text-2xl md:text-4xl font-semibold'>
										{playlist.title}
									</h3>
									{playlist.isPublic ? (
										<div className='ml-2 text-sm font-semibold bg-white bg-opacity-20 rounded-lg p-2 flex flex-row items-center space-x-2'>
											<LockOpenIcon className='h-6 w-6 text-gray-300' />
											<span>Pubblica</span>
										</div>
									) : (
										<div className='ml-2 text-sm font-semibold bg-white bg-opacity-20 rounded-lg p-2 flex flex-row items-center space-x-2'>
											<LockClosedIcon className='h-6 w-6 text-gray-300' />
											<span>Privata</span>
										</div>
									)}
								</div>
								{isPlaylistCreator() && (
									<div className='flex flex-row items-center space-x-4'>
										<PencilIcon
											className='h-6 w-6 text-gray-300 hover:text-white cursor-pointer'
											onClick={() => setShowUpdateModal(!showUpdateModal)}
										/>
										<TrashIcon
											className='h-6 w-6 text-gray-300 hover:text-red-600 cursor-pointer'
											onClick={() => setShowDeleteModal(true)}
										/>
									</div>
								)}
							</div>
							<p className='text-gray-300 mt-4'>{playlist.description}</p>
							{!isPlaylistCreator() ? (
								isFollowingPlaylist() ? (
									<div className='flex flex-row items-center space-x-4 mt-4'>
										<HeartIconFilled
											onClick={() => handleToggleFollowPlaylist()}
										/>
										<span className='text-gray-300'>Non seguire</span>
									</div>
								) : (
									<div className='flex flex-row items-center space-x-4 mt-4'>
										<HeartIcon onClick={() => handleToggleFollowPlaylist()} />
										<span className='text-gray-300'>Segui</span>
									</div>
								)
							) : (
								""
							)}
							<div className='flex flex-col h-max mt-10 space-y-2'>
								<span className='text-gray-300'>Tags</span>
								<div className='flex space-x-2'>
									{playlist.tags.map((tag, index) => (
										<span
											key={index}
											className='bg-gray-100 text-black cursor-pointer hover:bg-gray-300 inline-flex items-center px-4 py-1 text-lg font-medium cursor-pointer rounded-full'
										>
											{tag}
										</span>
									))}
								</div>
							</div>
							{isPlaylistCreator() && (
								<SearchSong
									playlist={playlist}
									setPlaylist={setPlaylist}
									setToastText={setToastText}
									setToastType={setToastType}
								/>
							)}
							<div className='mt-10 grid grid-cols-1 gap-y-2'>
								{playlist.tracks.map((track, index) => (
									<div
										className='flex flex-row items-center justify-between bg-black rounded-lg px-4 py-2 gap-x-2'
										key={index}
									>
										<div className='flex flex-row items-center space-x-4'>
											<div className='flex flex-row items-center gap-x-2'>
												{currentLiked.includes(track.id) ? (
													<HeartIconFilled
														className='h-6 w-6 text-gray-300 hover:text-white'
														onClick={() => handleToggleLikeSong(track)}
													/>
												) : (
													<HeartIcon
														className='h-6 w-6 text-gray-300 hover:text-white'
														onClick={() => handleToggleLikeSong(track)}
													/>
												)}
												<img
													src={track.image}
													alt='album_cover'
													width={50}
													height={50}
													className='object-contain rounded-lg'
												/>
											</div>
											<div className='flex flex-col'>
												<span className='text-lg font-bold'>
													{track.name}{" "}
													{track.explicit && (
														<span className='ml-2 text-sm font-semibold bg-white bg-opacity-20 rounded-lg p-2'>
															Explicit
														</span>
													)}
												</span>
												<span className='text-gray-400'>
													{track.artists
														.map((artist) => artist.name)
														.join(", ")}
												</span>
											</div>
											<p>{track.album}</p>
										</div>
										<div className='flex flex-row items-center space-x-4'>
											<p>{convertToMinutes(track.duration_ms)}</p>
											<Link href={track.external_urls[0]}>
												<PlayIcon className='h-6 w-6' />
											</Link>
											{isPlaylistCreator() && (
												<button
													className='bg-red-600 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-red-800'
													onClick={() => handleTrackDelete(track)}
												>
													Elimina
												</button>
											)}
										</div>
									</div>
								))}
							</div>
							{showUpdateModal && (
								<UpdatePlaylistModal
									playlist={playlist}
									setShowUpdateModal={setShowUpdateModal}
								/>
							)}
							{showDeleteModal && (
								<DeleteModal
									playlistId={playlist._id}
									setShowDeleteModal={setShowDeleteModal}
								/>
							)}
							{toastText !== "" && (
								<Toast
									label={toastText}
									type={toastType}
									onClose={() => setToastText("")}
								/>
							)}
						</div>
				  )}
		</SidebarLayout>
	);
}
