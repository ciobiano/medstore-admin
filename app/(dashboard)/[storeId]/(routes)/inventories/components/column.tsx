"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type InventoryColumn = {
	id: string;
	name: string;
	isFeatured: boolean;
	isOutOfStock: boolean;
	price: string;
	size: string;
	stock: number;
	manufacturer: string;
	category: string;
	createdAt: string;
};

export const columns: ColumnDef<InventoryColumn>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "manufacturer",
		header: "Manufacturer",
		
	},
	{
		accessorKey: "category",
		header: "Category",
	},
	{
		accessorKey: "isOutOfStock",
		header: "OutOfStock",
	},
	{
		accessorKey: "isFeatured",
		header: "Featured",
	},
	{
		accessorKey: "price",
		header: "Price",
	},
	{
		accessorKey: "stock",
		header: "Stock",
	},
	{
		accessorKey: "size",
		header: "Size",
	},
	
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		id: "action",
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
