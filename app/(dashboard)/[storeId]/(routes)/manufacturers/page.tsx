import prismadb from "@/lib/prismadb";
import ManufacturerClient from "./components/client";
import { format } from "date-fns";

const ManufacturersPage = async ({
	params,
}: {
	params: { storeId: string };
}) => {
	const manufacturer = await prismadb.manufacturer.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			name: "asc",
		},
	});
	const formattedManufacturer = manufacturer.map((item) => ({
		id: item.id,
		name: item.name,

		createdAt: format(item.createdAt, "MMMM do, yyyy"), // Convert createdAt to formatted string
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-x-3 p-8 pt-6">
				<ManufacturerClient data={formattedManufacturer} />
			</div>
		</div>
	);
};

export default ManufacturersPage;
