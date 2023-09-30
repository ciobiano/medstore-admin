import prismadb from "@/lib/prismadb";

import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { InventoryColumn } from "./components/column";
import InventoryClient from "./components/client";

const inventoryPage = async ({ params }: { params: { storeId: string } }) => {
	const inventories = await prismadb.inventory.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			manufacturer: true,
			category: true,
			sizes: {
				include: {
					size: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	const formattedProducts: InventoryColumn[] = inventories.map((item) => ({
		id: item.id,
		name: item.name,
		isFeatured: item.isFeatured,
		isOutOfStock: item.isOutOfStock,
		price: formatter.format(item.price.toNumber()),
		category: item.category.name,
		size: item.sizes.map((sizeObj) => sizeObj.size.value).join(", "),
		manufacturer: item.manufacturer.name,
		stock: item.stock,
		createdAt: format(item.createdAt, "MMMM do, yyyy"),
	}));
	return (
		<div className="flex-col ">
			<div className="flex-1 space-x-3 p-8 pt-6">
				<InventoryClient data={formattedProducts} />
			</div>
		</div>
	);
};

export default inventoryPage;
