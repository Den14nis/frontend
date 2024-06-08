"use client";

import { useEffect, useState } from "react";

import SidebarLayout from "../components/SidebarLayout";

import { makeAuthenticatedGetRequest } from "../utils/RestUtils";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import convertToMinutes from "../utils/Time";
import { Toast, ToastType } from "../components/Toast";
import {
  handleGetLikedSongsForUser,
  handleToggleLikedSong,
} from "../utils/SongUtils";

import { HeartIcon, HeartIconFilled } from "../components/HeartIcon";
import { useRouter } from "next/navigation";
import { useUser } from "../components/UserContext";

const PublicPlaylists = ({ setToastText, setToastType }) => {
  const router = useRouter();

  const [publicPlaylists, setPublicPlaylists] = useState([]);

  const fetchData = async () => {
    try {
      const result = await makeAuthenticatedGetRequest("/playlists/public");
      setPublicPlaylists(result.playlists);
    } catch (error) {
      setToastText(error.message);
      setToastType(ToastType.ERROR);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-4">
          <h3 className="text-xl font-bold mt-4 mx-4">Playlist pubbliche</h3>
          <p
            className="text-gray-300 mx-4 hover:text-white cursor-pointer"
            onClick={() => router.push("/public-playlists")}
          >
            Visualizza tutte
          </p>
        </div>
        <ArrowPathIcon
          className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer"
          onClick={() => fetchData()}
        />
      </div>
      <div className="flex flex-col space-y-4 mt-4">
        {publicPlaylists.map((playlist, index) => (
          <div
            className="flex flex-row justify-between items-center bg-[#000000] rounded-lg w-full relative py-4 px-4 cursor-pointer hover:bg-[#1F1F1F]"
            key={index}
            onClick={() => router.push(`/playlists/${playlist._id}`)}
          >
            <div className="flex flex-col space-y-2">
              <p className="font-semibold text-lg">{playlist.title}</p>
              <p className="text-gray-300">{playlist.description}</p>
              <p className="text-gray-300">
                Followers: {playlist.followers.length}
              </p>
              <p className="text-gray-300">Canzoni: {playlist.tracks.length}</p>
            </div>
            <div className="flex flex-row space-x-4 h-max">
              {playlist.tags.map((tag, index) => (
                <div
                  className="flex flex-row items-center gap-x-2 mt-2 w-max bg-white p-2 rounded-full"
                  key={index}
                >
                  <p className="text-black font-normal text-sm">{tag}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const truncateText = (text) => {
  if (text.length > 30) {
    return text.substring(0, 30) + "...";
  } else {
    return text;
  }
};

const Recommendations = ({ setToastText, setToastType, likedSongs }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [currentLiked, setCurrentLiked] = useState([]);

  const handleLike = async (song) => {
    try {
      const songToAdd = {
        id: song.id,
        name: song.name,
        artists: song.artists,
        external_urls: song.external_urls,
        image: song.image,
        explicit: song.explicit,
        duration_ms: song.duration_ms,
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
      console.error(error);
    }
  };

  const fetchData = async () => {
    const result = await makeAuthenticatedGetRequest(
      "/spotify/recommendations?limit=8"
    );
    if (result.error) {
      setToastText(result.error);
      setToastType(ToastType.ERROR);
    } else {
      const reccommendedTracks = result.message.tracks.map((track) => {
        return {
          id: track.id,
          name: track.name,
          artists: track.artists,
          external_urls: track.external_urls,
          image: track.album.images[0].url,
          explicit: track.explicit,
          duration_ms: track.duration_ms,
        };
      });
      setRecommendations(reccommendedTracks);
    }
  };

  const addCurrentLiked = async () => {
    setCurrentLiked(await handleGetLikedSongsForUser(likedSongs));
  };

  useEffect(() => {
    fetchData();
    addCurrentLiked();
  }, []);

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-xl font-bold mt-4 mx-4">Consigliate per te</h3>
        <ArrowPathIcon
          className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer"
          onClick={() => fetchData()}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center mt-4">
        {recommendations.map((recommendation, index) => (
          <div
            className="bg-[#000000] rounded-lg h-[320px] w-full relative"
            key={index}
          >
            {recommendation.explicit && (
              <p className="absolute top-4 right-4 bg-[#000000] bg-opacity-60 px-2 py-1">
                Explicit
              </p>
            )}
            <a href={recommendation.external_urls.spotify} target="_blank">
              <img
                src={recommendation.image}
                alt="album_cover"
                className="w-full h-[200px] object-contain rounded-t-lg"
              />
            </a>
            <div className="px-2">
              <h3 className="font-bold mt-4 text-sm">
                {truncateText(recommendation.name)}
              </h3>
              <h5 className="font-medium text-sm mt-2">
                {recommendation.artists.map((artist) => artist.name).join(", ")}
              </h5>
            </div>
            <div className="absolute bottom-2 w-full flex flex-row justify-between items-center px-2">
              <p className="text-sm">
                {convertToMinutes(recommendation.duration_ms)}
              </p>
              {currentLiked.includes(recommendation.id) ? (
                <HeartIconFilled
                  className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer"
                  onClick={() => handleLike(recommendation)}
                />
              ) : (
                <HeartIcon
                  className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer"
                  onClick={() => handleLike(recommendation)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [toastText, setToastText] = useState("");
  const [toastType, setToastType] = useState(ToastType.SUCCESS);

  const { user } = useUser();

  return (
    <SidebarLayout>
      {user && (
        <div className="space-y-10">
          <Recommendations
            setToastText={setToastText}
            setToastType={setToastType}
            likedSongs={user.likedSongs}
          />
          <PublicPlaylists
            setToastText={setToastText}
            setToastType={setToastType}
          />
        </div>
      )}
      {toastText !== "" && (
        <Toast
          label={toastText}
          type={toastType}
          onClose={() => setToastText("")}
        />
      )}
    </SidebarLayout>
  );
}
