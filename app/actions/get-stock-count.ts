import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string) => {
	const stockCount = await prismadb.inventory.count({
		where: {
			storeId,
			isOutOfStock: false,
		},
	});

	return stockCount;
};
