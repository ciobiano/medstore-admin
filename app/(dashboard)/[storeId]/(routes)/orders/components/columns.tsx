"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
	id: string;
	phone: string;
	address: string;
	product: string;
	quantity: string;
	isPaid: boolean;

	createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
	{
		accessorKey: "product",
		header: "Product",
	},
	{
		accessorKey: "phone",
		header: "Phone",
	},
	{
		accessorKey: "address",
		header: "Address",
	},
	{
		accessorKey: "isPaid",
		header: "Paid",
	},
	{
		accessorKey: "quantity",
		header: "Total quantity",
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
];
