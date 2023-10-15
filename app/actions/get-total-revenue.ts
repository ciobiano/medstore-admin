import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
	const paidOrders = await prismadb.order.findMany({
		where: {
			storeId,
			isPaid: true,
		},
		include: {
			orderItems: {
				include: {
					inventory: true,
				},
			},
		},
	});

	const totalRevenue = paidOrders.reduce((total, order) => {
		const orderTotal = order.orderItems.reduce((orderSum, item) => {
			return orderSum + item.inventory.price.toNumber();
		}, 0);
		return total + orderTotal;
	}, 0);

	return totalRevenue;
};
