"use client";

import classNames from "../utils/classNames";
import {
	CheckCircleIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";

const ToastType = {
	SUCCESS: "success",
	ERROR: "error",
};

const Toast = ({ label, type, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			id='toast-simple'
			className={classNames(
				type == ToastType.SUCCESS ? "bg-green-600" : "bg-red-600",
				"fixed bottom-10 left-1/2 transform -translate-x-1/2 flex items-center w-max p-4 text-white rounded-lg shadow z-[9999999]",
			)}
			role='alert'
		>
			<div className='text-md font-normal text-center w-full flex flex-row items-center justify-center'>
				{type === ToastType.SUCCESS && (
					<CheckCircleIcon className='h-6 w-6 mr-2' />
				)}
				{type === ToastType.ERROR && (
					<ExclamationTriangleIcon className='h-6 w-6 mr-2' />
				)}
				{label}
			</div>
		</div>
	);
};

export { ToastType, Toast };
