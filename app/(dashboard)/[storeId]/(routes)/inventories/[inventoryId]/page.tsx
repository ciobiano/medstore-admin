import prismadb from "@/lib/prismadb";
import { InventoryForm } from "./components/inventory-form";
import { Manufacturer } from "@prisma/client";

const ProductPage = async ({
	params,
}: {
	params: { inventoryId: string; storeId: string };
}) => {
	const inventory = await prismadb.inventory.findUnique({
		where: {
			id: params.inventoryId,
		},
		include: {
			images: true,
		},
	});

	const category = await prismadb.category.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	const sizes = await prismadb.size.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	const manufacturer = await prismadb.manufacturer.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<InventoryForm
					categories={category}
					ProductData={inventory}
					manufacturers={manufacturer}
					sizes={sizes}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
