"use client";

import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Manufacturer, Image, Inventory, Size } from "@prisma/client";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
	name: z.string().min(3),
	images: z.object({ url: z.string() }).array(),
	price: z.coerce.number().min(1),
	categoryId: z.string().min(1),
	manufacturerId: z.string().min(1),
	sizeId: z.string().min(1),
	isFeatured: z.boolean().default(false).optional(),
	stock: z.coerce.number().min(0), // New field
	description: z.string().min(3).max(120),
	isOutOfStock: z.boolean().default(false).optional(),
});

interface InventoryFormProps {
	ProductData:
		| (Inventory & {
				images: Image[];
		  })
		| null;
	categories: Category[];
	manufacturers: Manufacturer[];
	sizes: Size[];
}

type InventoryFormValue = z.infer<typeof formSchema>;

export const InventoryForm: React.FC<InventoryFormProps> = ({
	ProductData,
	categories,
	manufacturers,
	sizes,
}) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = ProductData ? `Edit Product` : "Create Product";
	const description = ProductData
		? `Edit a Product`
		: "Add a new product to your store.";
	const toastMessage = ProductData ? ` Product updated` : "Product created ";
	const action = ProductData ? `Save changes` : "Create";

	const defaultValues = ProductData
		? {
				...ProductData,
				price: parseFloat(String(ProductData?.price)),
		  }
		: {
				name: "",
				images: [],
				price: 0,
				categoryId: "",
				manufacturerId: "",
				sizeId: "",
				stock: 0,
				description: "",
				isFeatured: false,
				isOutOfStock: false,
		  };

	const form = useForm<InventoryFormValue>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const onSubmit = async (data: InventoryFormValue) => {
		try {
			setLoading(true);
			if (ProductData) {
				await axios.patch(
					`/api/${params.storeId}/inventories/${params.inventoryId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/inventories`, data);
			}
			router.refresh();
			router.push(`/${params.storeId}/inventories`);
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
				`/api/${params.storeId}/inventories/${params.productId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/inventories`);
			toast.success("Inventory deleted");
		} catch (error) {
			toast.error(" check if all section using this product are deleted first");
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
				{ProductData && (
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
					<FormField
						control={form.control}
						name="images"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product Image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value.map((image) => image.url)}
										disabled={loading}
										onChange={(url) =>
											field.onChange([...field.value, { url }])
										}
										onRemove={(url) =>
											field.onChange([
												...field.value.filter((current) => current.url !== url),
											])
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
											placeholder="product name "
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={loading}
											placeholder="9.99"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="stock"
							render={({ field }) => (
								<FormItem>
									<FormLabel>In-stock</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={loading}
											placeholder="0"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a category"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="sizeId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Size</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a size"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{sizes.map((size) => (
												<SelectItem key={size.id} value={size.id}>
													{size.name} {size.value}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="manufacturerId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Manufacturer</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a manufacturer"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{manufacturers.map((manufacturer) => (
												<SelectItem
													key={manufacturer.id}
													value={manufacturer.id}
												>
													{manufacturer.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isFeatured"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											// @ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Featured</FormLabel>
										<FormDescription>
											This product will appear on the home page
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isOutOfStock"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											// @ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Out of Stock</FormLabel>
										<FormDescription>
											This product will not appear anywhere in the store.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									{/* <FormLabel>Description</FormLabel> */}
									<FormControl>
										<Textarea
											disabled={loading}
											placeholder="product description..... "
											{...field}
											className="h-32"
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
