import prismadb from "@/lib/prismadb";

import { SizeColumn } from "./components/column";
import { format } from "date-fns";
import SizeClient from "./components/client";

const SizePage = async ({ params }: { params: { storeId: string } }) => {
	const size = await prismadb.size.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	const formattedSizes: SizeColumn[] = size.map((item) => ({
		id: item.id,
		name: item.name,
		value: item.value,
		createdAt: format(item.createdAt, "MMMM do, yyyy"),
	}));
	return (
		<div className="flex-col ">
			<div className="flex-1 space-x-3 p-8 pt-6">
				<SizeClient data={formattedSizes} />
			</div>
		</div>
	);
};

export default SizePage;
