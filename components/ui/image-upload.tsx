"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, TrashIcon } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	disabled,
	onChange,
	onRemove,
	value,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const onUpload = (result: any) => {
		onChange(result.info.secure_url);
	};

	if (!isMounted) {
		return null;
	}

	return (
		<div>
			<div className="mb-4 items-center flex gap-4">
				{value.map((url) => (
					<div
						className="w-[200px] h-[200px] relative rounded-md overflow-hidden"
						key={url}
					>
						<div className="absolute top-2 right-2 z-10">
							<Button
								type="button"
								onClick={() => onRemove(url)}
								variant="destructive"
							>
								<TrashIcon className="w-4 h-4" />
							</Button>
						</div>
						<Image fill className="object-cover" alt="image" src={url} />
					</div>
				))}
			</div>
			<CldUploadWidget onUpload={onUpload} uploadPreset="wcnmc2lk">
				{({ open }) => {
					const onClick = () => {
						open();
					};
					return (
						<Button
							type="button"
							disabled={disabled}
							variant="secondary"
							onClick={onClick}
						>
							<ImagePlus className="h-4  w-4 mr-2" />
							upload an Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUpload;
