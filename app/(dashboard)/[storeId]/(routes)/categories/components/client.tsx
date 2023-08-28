"use client";

import { Button } from "@/components/ui/button";

import Heading from "@/components/ui/header";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { ApiList } from "@/components/ui/api-list";

interface CategoryProps {
	data: CategoryColumn[];
}
const CategoryClient: React.FC<CategoryProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			{" "}
			<div className="flex items-center  justify-between  ">
				<Heading
					title={`Categories (${data.length})`}
					description="Manage the Category layout"
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/categories/new `)}
				>
					<Plus className="h-4 w-4" />
					Add new
				</Button>
			</div>
			<Separator />
			<DataTable searchKey="name" columns={columns} data={data} />
			<Heading title="API" description="this is an api list for routes" />
			<Separator />
			<ApiList entityIdName="categoryId" entityName="categories" />
		</>
	);
};

export default CategoryClient;
