"use client";

import { useState } from "react";
import SidebarLayout from "../../../components/SidebarLayout";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import SwitchToggle from "../../../components/SwitchToggle";
import {
	makeAuthenticatedGetRequest,
	makeAuthenticatedPostRequest,
} from "../../../utils/RestUtils";

export default function CreatePlaylist() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [temporaryTag, setTemporaryTag] = useState("");
	const [tags, setTags] = useState([]);
	const [isPublic, setIsPublic] = useState(false);
	const [tracks, setTracks] = useState([]);

	const [searchQuery, setSearchQuery] = useState("");
	const [responseElements, setResponseElements] = useState([]);
	const [errors, setErrors] = useState([]);

	const searchSong = async (e) => {
		e.preventDefault();
		const res = await makeAuthenticatedGetRequest(
			`/spotify/search?type=track&q=${searchQuery}&limit=4`,
		);

		setResponseElements(res.message.tracks.items);
	};

	function truncateText(text) {
		if (text.length > 30) {
			return text.substring(0, 30) + "...";
		} else {
			return text;
		}
	}

	const validateForm = () => {
		setErrors([]);
		if (!title || title === "") {
			const label = "Il titolo è obbligatorio";
			setErrors((prevErrors) => [...prevErrors, label]);
		}
		if (!description || description === "") {
			const label = "La descrizione è obbligatoria";
			setErrors((prevErrors) => [...prevErrors, label]);
		}
		if (tags.length === 0) {
			const label = "Devi inserire almeno un tag";
			setErrors((prevErrors) => [...prevErrors, label]);
		}
		if (tracks.length === 0) {
			const label = "Devi inserire almeno una canzone";
			setErrors((prevErrors) => [...prevErrors, label]);
		}

		if (errors.length > 0) {
			return false;
		}

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}

		try {
			const res = await makeAuthenticatedPostRequest("/playlists/", {
				title: title,
				description: description,
				tags: tags,
				isPublic: isPublic,
				tracks: tracks,
			});

			window.location.href = "/";
		} catch (error) {
			setErrors([error.message]);
		}
	};

	return (
		<SidebarLayout>
			<div className='mx-auto max-w-[1200px]'>
				<h1 className='text-4xl font-bold mt-4 mx-4 py-10'>Crea playlist</h1>
				<form
					className='w-full grid grid-cols-1 py-4 px-2'
					onSubmit={handleSubmit}
				>
					<div className='text-white flex flex-col mt-4 space-y-2'>
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
						/>
					</div>
					<div className='text-white flex flex-col mt-4 space-y-2'>
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
					<div className='text-white flex flex-col mt-4 space-y-2'>
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
							<PlusIcon
								className='bg-[#1ed760] h-8 w-8 rounded-lg cursor-pointer hover:bg-[#06cc4d]'
								onClick={() => {
									if (temporaryTag !== "") {
										setTags([...tags, temporaryTag]);
										setTemporaryTag("");
									}
								}}
							>
								Aggiungi
							</PlusIcon>
						</div>
						<div className='flex flex-row items-center mt-2 space-x-2'>
							{tags.map((tag, index) => (
								<div
									className='flex flex-row items-center gap-x-2 mt-2 w-max bg-white p-2 rounded-full'
									key={index}
								>
									<p className='text-black font-normal text-sm'>{tag}</p>
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
								<a href={responseElement.external_urls.spotify} target='_blank'>
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
									{tracks.some((track) => track.id === responseElement.id) ? (
										<XMarkIcon
											className='h-6 w-6 text-gray-300 hover:text-white cursor-pointer'
											onClick={() => {
												setTracks(
													tracks.filter(
														(track) => track.id !== responseElement.id,
													),
												);
											}}
										/>
									) : (
										<PlusIcon
											className='h-6 w-6 text-gray-300 hover:text-white cursor-pointer'
											onClick={() => {
												setTracks([
													...tracks,
													{
														id: responseElement.id,
														name: responseElement.name,
														artists: responseElement.artists,
														external_urls:
															typeof responseElement.external_urls === Array
																? responseElement.external_urls[0].spotify
																: responseElement.external_urls.spotify,
														image: responseElement.album.images[0].url,
														explicit: responseElement.explicit,
														duration_ms: responseElement.duration_ms,
													},
												]);
											}}
										/>
									)}
								</div>
							</div>
						))}
					</div>
					<div className='mt-6 grid grid-cols-1 gap-y-2'>
						{tracks.map((track, index) => (
							<div
								className='flex flex-row items-center justify-between bg-black rounded-lg px-4 py-2 gap-x-2'
								key={index}
							>
								<div className='flex flex-row items-center gap-x-2'>
									<img
										src={track.image}
										alt='album_cover'
										className='w-10 h-10 object-contain rounded-lg'
									/>
									<p className='ml-2 font-medium'>{track.name}</p>
								</div>
								<XMarkIcon
									className='h-6 w-6 text-gray-300 hover:text-white cursor-pointer'
									onClick={() => {
										setTracks(tracks.filter((t) => t.id !== track.id));
									}}
								/>
							</div>
						))}
					</div>
					<div className='text-white flex flex-row items-center mt-4 space-x-4'>
						<label htmlFor='isPublic' className='text-lg'>
							Vuoi rendere la playlist pubblica?
						</label>
						<SwitchToggle
							label='Pubblica'
							checked={isPublic}
							onChange={() => setIsPublic(!isPublic)}
						/>
					</div>
					<input
						type='submit'
						value='Crea playlist'
						className='bg-[#1ed760] text-white py-2 px-4 rounded-lg mt-4 cursor-pointer hover:bg-[#06cc4d]'
					/>
				</form>
				{errors.length > 0 &&
					errors.map((error, index) => (
						<p className='text-red-600 text-lg mt-4' key={index}>
							{error}
						</p>
					))}
			</div>
		</SidebarLayout>
	);
}
