"use client"

import { useModalDialog } from "@/hooks/use-modal-dialog";
import { Modal } from "../ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useState } from "react";

import * as z from "zod";
import toast from "react-hot-toast";

import axios from "axios";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
	name: z.string().min(3, "Too Short!").max(100, "Too Long!"),
});

export const StoreModal = () => {

    const StoreModal = useModalDialog();


    const [loading, setLoading ] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({

        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        
        try {
            setLoading(true);
            const response = await axios.post("/api/store", data);
            window.location.assign(`/${response.data.id}`);
        } catch (error) {
            toast.error('something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
			<Modal
				title="Create New Store"
				description="create a new to to sell your product"
				isOpen={StoreModal.isOpen}
				onClose={StoreModal.onClose}
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
													placeholder="Online medication store"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="pt-6 items-center justify-end flex space-x-4">
									<Button
										disabled={loading}
										variant="outline"
										onClick={StoreModal.onClose}
									>
										cancel
									</Button>
									<Button disabled={loading} type="submit">
										continue
									</Button>
								</div>
							</form>
						</Form>
					</div>
				</div>
			</Modal>
		);
}

