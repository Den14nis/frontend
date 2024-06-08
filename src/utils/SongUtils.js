import {
	makeAuthenticatedGetRequest,
	makeAuthenticatedPutRequest,
} from "./RestUtils";

const mapById = (array) => {
	const likedSongs = array.map((song) => song.id);

	return likedSongs;
};

const handleToggleLikedSong = async (track) => {
	const song = {
		id: track.id,
		name: track.name,
		artists: track.artists,
		external_urls: track.external_urls,
		image: track.image,
		explicit: track.explicit,
		duration_ms: track.duration_ms,
	};
	await makeAuthenticatedPutRequest("/users/likedSongs", song);

	return song;
};

const handleGetLikedSongsForUser = async () => {
	const currentLiked = await makeAuthenticatedGetRequest("/users/likedSongs");
	return mapById(currentLiked.likedSongs);
};

export { handleToggleLikedSong, handleGetLikedSongsForUser };
