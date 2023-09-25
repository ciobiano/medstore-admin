"use client";

import Heading from "@/components/ui/header";

import { OrderColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

interface OrderProps {
	data: OrderColumn[];
}
const OrderClient: React.FC<OrderProps> = ({ data }) => {
	return (
		<>
			<Heading
				title={`Order (${data.length})`}
				description="Manage the Order layout"
			/>

			<Separator />
			<DataTable searchKey="inventory" columns={columns} data={data} />
		</>
	);
};

export default OrderClient;
