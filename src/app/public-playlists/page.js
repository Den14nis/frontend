"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarLayout from "../../components/SidebarLayout";
import { useInView } from "react-intersection-observer";
import { makeAuthenticatedGetRequest } from "../../utils/RestUtils";
import { Toast, ToastType } from "../../components/Toast";

export default function PublicPlaylists() {
	const router = useRouter();

	const [publicPlaylists, setPublicPlaylists] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);

	const [toastText, setToastText] = useState("");
	const [toastType, setToastType] = useState(ToastType.ERROR);

	const { ref, inView } = useInView();

	const fetchData = useCallback(async () => {
		if (loading || !hasMore) return;
		setLoading(true);

		try {
			const response = await makeAuthenticatedGetRequest(
				"/playlists/public?page=" + page,
			);
			if (response.playlists.length === 0) {
				setHasMore(false);
			} else {
				setPublicPlaylists([...publicPlaylists, ...response.playlists]);
				setPage(page + 1);
			}
		} catch (error) {
			setToastText(error.message);
		} finally {
			setLoading(false);
		}
	}, [page, hasMore, loading]);

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (inView) {
			fetchData();
		}
	}, [inView, fetchData]);

	return (
		<SidebarLayout>
			<div className='mx-auto max-w-[1200px]'>
				<h1 className='text-4xl font-bold mt-4 py-10'>Playlist pubbliche</h1>
				<div className='space-y-4'>
					{publicPlaylists.map((playlist, index) => (
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
					))}
				</div>
				<div ref={ref} className='mt-4'>
					{loading && <p>Carico altre playlist pubbliche</p>}
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
