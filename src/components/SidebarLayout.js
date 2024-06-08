"use client";

import { useEffect } from "react";
import Header from "./Header";
import { useUser } from "./UserContext";
import { getLoginToken } from "../utils/localStorage";
import { makeAuthenticatedGetRequest } from "../utils/RestUtils";

export default function SidebarLayout({ children }) {
	const { user } = useUser();
	const { saveUserDataToStorage } = useUser();

	useEffect(() => {
		if (getLoginToken()) {
			const fetchData = async () => {
				try {
					const result = await makeAuthenticatedGetRequest("/users/me");
					saveUserDataToStorage(result.user);
				} catch (error) {
					if (error.status === 401) {
						window.location.href = "/login";
					}
				}
			};
			fetchData();
		} else {
			window.location.href = "/login";
		}
	}, []);

	return (
		<div className='text-white flex flex-row'>
			<div className='sticky top-0 left-0 h-screen basis-1/4 bg-[#000000]'>
				<Header />
			</div>
			<div className='basis-3/4 bg-[#1d1d1d] md:px-2'>{children}</div>
		</div>
	);
}
