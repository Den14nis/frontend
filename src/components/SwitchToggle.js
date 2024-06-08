import { Switch } from "@headlessui/react";

import classNames from "../utils/classNames";

const SwitchToggle = ({ label, checked, onChange }) => {
	return (
		<Switch.Group as='div' className='flex gap-x-4 sm:col-span-2'>
			<div className='flex h-6 items-center'>
				<Switch
					checked={checked}
					onChange={onChange}
					className={classNames(
						checked ? "bg-[#1ed760]" : "bg-white",
						"flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
					)}
				>
					<span
						aria-hidden='true'
						className={classNames(
							checked ? "translate-x-3.5" : "translate-x-0",
							"h-4 w-4 transform rounded-full bg-gray-900 shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out",
						)}
					/>
				</Switch>
			</div>
		</Switch.Group>
	);
};

export default SwitchToggle;
