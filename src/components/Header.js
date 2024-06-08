"use client";

import {
	ArrowLeftEndOnRectangleIcon,
	Cog6ToothIcon,
	HeartIcon,
	HomeIcon,
	MagnifyingGlassIcon,
	PlusIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";

import { useUser } from "../components/UserContext";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
	const router = useRouter();

	const { user, deleteUserDataFromStorage } = useUser();

	return (
		<div className='h-full flex grow flex-col gap-y-5 overflow-y-auto px-6 py-10'>
			<div className='flex flex-col gap-y-5 bg-[#1d1d1d] p-4 rounded-lg'>
				<div
					className='flex flex-row items-center text-white font-semibold text-md cursor-pointer'
					onClick={() => router.push("/")}
				>
					<HomeIcon className='h-6 w-6' />
					<p className='ml-2'>Home</p>
				</div>
				<div
					className='flex flex-row items-center text-white font-semibold text-md cursor-pointer'
					onClick={() => router.push("/search")}
				>
					<MagnifyingGlassIcon className='h-6 w-6' />
					<p className='ml-2'>Cerca</p>
				</div>
			</div>
			<div className='flex flex-row items-center bg-[#1d1d1d] p-4 rounded-lg'>
				<div className='w-full flex flex-row items-center justify-between gap-y-1 text-white '>
					<div className='flex flex-row items-center'>
						<UserCircleIcon className='h-6 w-6' />
						{user && user.email && (
							<p className='ml-2 font-semibold'>{user.email}</p>
						)}
					</div>
					<div className='flex flex-row items-center space-x-2'>
						<ArrowLeftEndOnRectangleIcon
							className='h-6 w-6 cursor-pointer'
							onClick={() => {
								deleteUserDataFromStorage();
								router.push("/login");
							}}
						/>
						<Cog6ToothIcon
							className='h-6 w-6 cursor-pointer'
							onClick={() => router.push("/user")}
						/>
					</div>
				</div>
			</div>
			<div className='flex flex-col gap-y-5 bg-[#1d1d1d] p-4 rounded-lg'>
				<h3 className='font-bold'>Le tue playlists</h3>
				<div className='flex flex-row items-center text-white cursor-pointer space-x-2'>
					<div className='bg-[#3d3d3d] p-2'>
						<HeartIcon className='h-6 w-6 stroke-2' />
					</div>
					<Link className='ml-2 font-medium' href='/user/liked-songs'>
						Canzoni che ti piacciono
					</Link>
				</div>
				{user && user.likedPlaylists && user.likedPlaylists.length > 0 ? (
					<>
						{user.likedPlaylists.map((playlist) => (
							<div
								className='flex flex-row items-center text-white cursor-pointer space-x-2'
								key={playlist.id}
								onClick={() => router.push(`/playlists/${playlist.id}`)}
							>
								<div className='bg-[#3d3d3d] p-2'>
									<HeartIcon className='h-6 w-6 stroke-2' />
								</div>
								<p className='ml-2 font-medium'>{playlist.title}</p>
							</div>
						))}
						<div
							className='flex flex-row items-center text-white cursor-pointer space-x-2'
							onClick={() => {
								router.push("/playlists/create");
							}}
						>
							<div className='bg-[#3d3d3d] p-2'>
								<PlusIcon className='h-6 w-6 stroke-2' />
							</div>
							<p className='ml-2 font-medium'>Crea playlist</p>
						</div>
					</>
				) : (
					<div>
						<p className='font-semibold text-md'>Non hai playlist preferite</p>
						<button
							className='flex flex-row items-center text-white cursor-pointer px-4 py-2 rounded-full font-semibold mt-4 bg-[#1ed760]'
							onClick={() => {
								router.push("/playlists/create");
							}}
						>
							Crea playlist
						</button>
					</div>
				)}
			</div>
			<div className='flex flex-col gap-y-5 bg-[#1d1d1d] p-4 rounded-lg'>
				<h3 className='font-bold'>I tuoi artisti</h3>
				{user && user.likedArtists.length > 0 ? (
					user.likedArtists.map((artist) => (
						<div
							className='flex flex-row items-center text-white cursor-pointer space-x-2'
							key={artist.id}
							onClick={() => router.push(artist.external_urls.spotify)}
						>
							<img src={artist.image} alt='artist' className='h-10 w-10' />
							<p className='ml-2 font-medium'>{artist.name}</p>
						</div>
					))
				) : (
					<p>Non hai artisti preferiti</p>
				)}
			</div>
		</div>
	);
}
