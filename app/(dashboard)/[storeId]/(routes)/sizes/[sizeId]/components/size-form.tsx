"use client";

import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
	name: z.string().min(3),
	value: z.string().min(1),
});

interface SizeFormProps {
	SizeData: Size | null;
}

type SizeFormValue = z.infer<typeof formSchema>;

export const SizeForm: React.FC<SizeFormProps> = ({ SizeData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = SizeData ? `Edit Size` : "Create Size";
	const description = SizeData ? `Edit a Size` : "Add a new size";
	const toastMessage = SizeData ? ` Size updated` : "Size created ";
	const action = SizeData ? `Save changes` : "Create";

	const form = useForm<SizeFormValue>({
		resolver: zodResolver(formSchema),
		defaultValues: SizeData || {
			name: "",
			value: "",
		},
	});

	const onSubmit = async (data: SizeFormValue) => {
		try {
			setLoading(true);
			if (SizeData) {
				await axios.patch(
					`/api/${params.storeId}/sizes/${params.sizeId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/sizes`, data);
			}
			router.refresh();
			router.push(`/${params.storeId}/sizes`);
			toast.success(toastMessage);
		} catch (error: any) {
			toast.error("Something went wrong.");
		} finally {
			setLoading(false);
		}
	};
	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(
				`/api/${params.storeId}/sizes/${params.sizeId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/sizes`);
			toast.success("Size deleted");
		} catch (error:any) {
			toast.error(
				" check if all categories using this size are deleted first"
			);
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
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex justify-between items-center">
				<Heading title={title} description={description} />
				{SizeData && (
					<Button
						disabled={loading}
						variant="destructive"
						size="icon"
						onClick={() => setOpen(true)}
					>
						<TrashIcon className="h-4 w-4" />
					</Button>
				)}
			</div>

			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Size label"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Size value"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>

			<Separator />
		</>
	);
};
