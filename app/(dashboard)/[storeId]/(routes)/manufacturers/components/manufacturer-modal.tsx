"use client";

import { useModalDialog } from "@/hooks/use-modal-dialog";
import { Modal } from "@/components/ui/modal";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";

import * as z from "zod";
import toast from "react-hot-toast";

import axios from "axios";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Manufacturer } from "@prisma/client";
import { TrashIcon } from "lucide-react";
import { ManufacturerColumn } from "./column";
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
	name: z.string().min(3, "Too Short!").max(100, "Too Long!"),
});

interface ManufacturerProps {
	ManufacturerData: Manufacturer| ManufacturerColumn | null;
	isOpen: boolean;
	onClose: () => void;
	mode: "edit" | "create";
}

export const ManufacturerModal: React.FC<ManufacturerProps> = ({
	ManufacturerData,
	isOpen,
	onClose,
	mode,
}) => {
	const params = useParams();
	const router = useRouter();

	
	const [open, setOpen] = useState(false);

	const [loading, setLoading] = useState(false);

	const defaultValues =
		mode === "edit" && ManufacturerData
			? { name: ManufacturerData.name }
			: { name: "" };

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues, // Use the conditionally set defaultValues
	});

	const title = ManufacturerData ? `Edit manufacturer` : "Create manufacturer";
	const description = ManufacturerData ? `Edit a manufacturer` : "Add a new manufacturer";
	const toastMessage = ManufacturerData ? ` manufacturer updated` : "manufacturer created ";
	const action = ManufacturerData ? `Save changes` : "Create";

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			setLoading(true); // Start loading spinner

			if (mode === "create") {
				// Create logic
				await axios.post(`/api/${params.storeId}/manufacturers`, data);
				toast.success("Manufacturer created");
			} else if (mode === "edit") {
				// Edit logic
				if (ManufacturerData?.id) {
					// Check if ID exists
					await axios.patch(
						`/api/${params.storeId}/manufacturers/${ManufacturerData.id}`, // Use the ID in API route
						data
					);
					toast.success("Manufacturer updated");
				}
			}

			router.refresh(); // Refresh the page or data
			onClose(); // Close the modal
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setLoading(false); // Stop loading spinner
		}
	};
	const onDelete = async () => {
		try {
			setLoading(true);
			if (ManufacturerData?.id) {
				// Ensure that ID exists
				await axios.delete(
					`/api/${params.storeId}/manufacturers/${ManufacturerData.id}`
				);
				router.refresh();
				toast.success("Manufacturer deleted");
				onClose(); // Close the modal
			}
		} catch (error) {
			toast.error("Check if products with this manufacturer are deleted first");
		} finally {
			setLoading(false);
		}
	};

	
	const onCancel = () => {
		form.reset(defaultValues); // Reset the form to the default values
		onClose(); // Close the modal
	};

	return (
		<Modal
			title={title}
			description={description}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div>
				<div className="space-y-4 p">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>

										<FormControl>
											<Input
												disabled={loading}
												placeholder="Manufacturer Name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="pt-4 justify-end flex space-x-4">
								{ManufacturerData && (
									<Button
										disabled={loading}
										variant="ghost"
										size='sm'
										onClick={onDelete}
										className="text-red-500 hover:text-red-600"
									>
										Delete manufacturer
										<TrashIcon className="ml-2 h-4 w-4" />
									</Button>
								)}
							</div>
							<div className="pt-6 items-center justify-end flex space-x-4">
								<Button
									disabled={loading}
									variant="outline"
									onClick={onCancel}
								>
									cancel
								</Button>
								<Button disabled={loading} type="submit">
									{action}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</Modal>
	);
};
