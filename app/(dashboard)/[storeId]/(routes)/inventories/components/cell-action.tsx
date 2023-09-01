"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InventoryColumn } from "./column";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Pencil, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modal/alert-modal";

interface CellActionProps {
	data: InventoryColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const onCopy = () => {
		navigator.clipboard.writeText(data.id);
		toast.success("Copied to clipboard");
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/inventories/${data.id}`);
			router.refresh();

			toast.success("Product deleted");
		} catch (error) {
			toast.error("Failed to delete the product. Please try again.");

		} finally {
			setLoading(false);
			setOpen(false);
		}
	};
	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={() => onDelete()}
				loading={loading}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="secondary" className="h-8 w-8 p-0">
						<span className=" sr-only">open menu</span>
						<MoreHorizontal className="h-4 2-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => onCopy()}>
						<Copy className="mr-2 h-4 w-4" />
						Copy
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							router.push(`/${params.storeId}/inventories/${data.id}`)
						}
					>
						<Pencil className="mr-2 h-4 w-4" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Trash className="mr-2 h-4 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
