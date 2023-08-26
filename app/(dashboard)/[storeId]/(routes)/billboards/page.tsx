import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/client";
// import { Billboard } from "@prismadb/client";
import { BillboardColumn } from "./components/column";
import { id } from "date-fns/locale";
import { format } from "date-fns";

const BillboardPage = async ({ params }: { params: { storeId: string } }) => {
	const billboard = await prismadb.billboard.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	const formattedBillboard: BillboardColumn[] = billboard.map((item) => ({
		id: item.id,
		label: item.label,
		createdAt: format(item.createdAt, "MMMM do, yyyy"),
	}));
	return (
		<div className="flex-col ">
			<div className="flex-1 space-x-3 p-8 pt-6">
				<BillboardClient data={formattedBillboard} />
			</div>
		</div>
	);
};

export default BillboardPage;
