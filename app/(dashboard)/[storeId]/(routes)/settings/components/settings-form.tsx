"use client"


import { AlertModal } from "@/components/modal/alert-modal";
import { ApiClip } from "@/components/ui/api-clip";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";


interface SettingsFormProps {
    storeData: Store;
}

const formSchema = z.object({
	name: z.string().min(3),
});

type SettingsFormValue = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps>  = ({
    storeData
}) => {

    const params = useParams();
	const router = useRouter();
	const origin = useOrigin();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

const form = useForm<SettingsFormValue>({
		resolver: zodResolver(formSchema),
		defaultValues: storeData,
	});

    const onSubmit = async (data: SettingsFormValue) => {
			try {
				setLoading(true);
				await axios.patch(`/api/store/${params.storeId}`, data);
				router.refresh();
				toast.success("store updated");
			} catch (error) {
				toast.error("something went wrong");
			} finally {
				setLoading(false);
			}
		};

		const onDelete = async () => {
			try {
				setLoading(true);
				await axios.delete(`/api/store/${params.storeId}`);
				router.refresh();
				router.push("/");
				toast.success("store deleted");
			} catch (error) {
				toast.error(" Make sure all products and categories are removed first");
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
				<div className="border-gray-200 border-2 rounded-lg space-y-8 lg:mx-auto shadow-lg shadow-gray-500/50  p-4">
					<div className="flex justify-between items-center">
						<Heading
							title="Settings"
							description="Manage your store settings"
						/>
					</div>
					<Separator className="" />
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
													placeholder="Store Name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Button disabled={loading} className="ml-auto" type="submit">
								save changes
							</Button>
						</form>
					</Form>
					<Separator />

					<ApiClip
						title="STORE API"
						description={`${origin}/api/${params.storeId}`}
						variant="Public"
					/>
					<div className="flex w-full  ">

					<Button
						disabled={loading}
						variant="destructive"
						
						onClick={() => setOpen(true)}
						className="ml-auto flex hover:bg-red-500/10 hover:text-red-500 gap-x-2 "
						
					>
						Delete Store
						<TrashIcon className="h-4 w-4" />
					</Button>
					</div>
				</div>
			</>
		);
}
 
