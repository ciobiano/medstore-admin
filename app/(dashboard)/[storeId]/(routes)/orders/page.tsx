import prismadb from "@/lib/prismadb";
import { OrderColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import OrderClient from "./components/client";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
	const orders = await prismadb.order.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			orderItems: {
				include: {
					inventory: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	const formattedBillboard: OrderColumn[] = orders.map((item) => ({
		id: item.id,
		phone: item.phone,
		address: item.address,
		product: item.orderItems
			.map((orderItem) => orderItem.inventory.name)
			.join(", "),
		quantity: item.quantity,
		isPaid: item.isPaid,
		createdAt: format(item.createdAt, "MMMM do, yyyy"),
	}));
	return (
		<div className="flex-col ">
			<div className="flex-1 space-x-3 p-8 pt-6">
				<OrderClient data={formattedBillboard} />
			</div>
		</div>
	);
};

export default OrdersPage;
