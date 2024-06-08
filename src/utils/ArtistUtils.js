import {
	makeAuthenticatedPutRequest,
	makeAuthenticatedGetRequest,
} from "./RestUtils";

const mapById = (array) => {
	const likedArtists = array.map((artist) => artist.id);

	return likedArtists;
};

const handleToggleLikedArtist = async (artist) => {
	await makeAuthenticatedPutRequest("/users/likedArtists", artist);

	return artist;
};

const handleGetLikedArtistsForUser = async () => {
	const currentLiked = await makeAuthenticatedGetRequest("/users/likedArtists");
	return mapById(currentLiked.likedArtists);
};

export { handleToggleLikedArtist, handleGetLikedArtistsForUser };
