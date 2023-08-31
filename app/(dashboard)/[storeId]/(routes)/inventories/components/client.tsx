"use client";

import { Button } from "@/components/ui/button";

import Heading from "@/components/ui/header";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { InventoryColumn, columns } from "./column";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { ApiList } from "@/components/ui/api-list";

interface InventoryClientProps {
	data: InventoryColumn[];
}
const InventoryClient: React.FC<InventoryClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			{" "}
			<div className="flex items-center  justify-between  ">
				<Heading
					title={`Inventory (${data.length})`}
					description="Manage the Inventory displayed on your store"
				/>
				<Button onClick={() => router.push(`/${params.storeId}/inventories/new `)}>
					<Plus className="h-4 w-4" />
					Add new
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="name" columns={columns} data={data} />
			<Heading title="API" description="this is an api list for routes" />
			<Separator />
			<ApiList entityIdName="inventoryId" entityName="inventories" />
		</>
	);
};

export default InventoryClient;
