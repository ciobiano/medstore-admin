"use client";

import { Button } from "@/components/ui/button";


import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./column";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { ApiList } from "@/components/ui/api-list";
import Heading from "@/components/ui/header";

interface BillboardProps {
	data: BillboardColumn[];
}
const BillboardClient: React.FC<BillboardProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			{" "}
			<div className="flex items-center  justify-between  ">
				<Heading
					title={`Billboard (${data.length})`}
					description="Manage the Billboard layout"
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/billboards/new `)}
				>
					<Plus className="h-4 w-4" />
					Add new
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="label" columns={columns} data={data} />
			<Heading title="API" description="this is an api list for routes" />
			<Separator />
			<ApiList entityIdName="billboardId" entityName="billboards" />
		</>
	);
};

export default BillboardClient;
