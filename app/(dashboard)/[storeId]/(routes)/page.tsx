import Heading from "@/components/ui/header";
import prismadb from "@/lib/prismadb";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TbChartPieFilled, TbCurrencyNaira } from "react-icons/tb";
import { FcSalesPerformance } from "react-icons/fc";
import { formatter } from "@/lib/utils";
import { getTotalRevenue } from "@/app/actions/get-total-revenue";
import { getSalesCount } from "@/app/actions/get-sales-count";
import { getStockCount } from "@/app/actions/get-stock-count";
import {getTotalInventoryStock} from "@/app/actions/get-quantity-count";
import { Overview } from "@/components/overview";
import { getGraphRevenue } from "@/app/actions/get-graph-revenue";
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { RecentSales } from "@/components/resent-sales";
import { format } from "date-fns";

interface DashboardPageProps {
	params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
	const totalRevenue = await getTotalRevenue(params.storeId);
	const salesCount = await getSalesCount(params.storeId);
	const stockCount = await getStockCount(params.storeId);
	const totalInventory = await getTotalInventoryStock(params.storeId)
	const graphRevenue = await getGraphRevenue(params.storeId);


	const order = await prismadb.order.findMany({
		where: {
			storeId: params.storeId,
			isPaid: true
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

	const recentSales = order.map((item) => ({
		id: item.id,
		phone: item.phone,
		address: item.address,
		amount : item.amount.toNumber(),
		createdAt: format(item.createdAt, "MMMM do, yyyy"),
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<Heading title="Dashboard" description="Overview of store" />
				<Separator />
				<div className="grid gap-4 grid-cols-4">
					<Card className="h-[12em] bg-[#29CC39] text-white/95">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
							<CardTitle className="text-lg font-medium justify-center items-center">
								Total Revenue
							</CardTitle>
							<TbCurrencyNaira className="h-6 w-6 bg-[#13BF24] rounded-sm" />
						</CardHeader>
						<CardContent className="flex  items-center justify-center">
							<div className="text-2xl font-bold ">
								{formatter.format(totalRevenue)}
							</div>
						</CardContent>
					</Card>
					<Card className="h-[12em] bg-[#8833FF]  text-white/95">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
							<CardTitle className="text-lg font-medium">Sales</CardTitle>
							<FcSalesPerformance className="h-6 w-6  bg-[#7919FF] rounded-sm " />
						</CardHeader>
						<CardContent className="flex items-center justify-center">
							<div className="text-2xl font-bold">+{salesCount}</div>
						</CardContent>
					</Card>
					<Card className="h-[12em] bg-[#FF6633] text-white/95">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
							<CardTitle className="text-lg font-medium">
								Products In Stock
							</CardTitle>
							<TbChartPieFilled className="h-6 w-6 bg-[#E64B17] rounded-full" />
						</CardHeader>
						<CardContent className="flex items-center justify-center">
							<div className="text-2xl font-bold">{stockCount}</div>
						</CardContent>
					</Card>
					<Card className="h-[12em] bg-[#1A2233] text-white/95">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
							<CardTitle className="text-lg font-medium">
								Total quantity In Stock
							</CardTitle>
							<MdOutlineProductionQuantityLimits className="h-6 w-6 bg-[#26334D] rounded-sm" />
						</CardHeader>
						<CardContent className="flex items-center justify-center">
							<div className="text-2xl font-bold">
								{totalInventory}
								<span className="text-sm font-medium ml-2 ">items</span>
							</div>
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
					<Card className="col-span-4">
						<CardHeader>
							<CardTitle>Overview</CardTitle>
						</CardHeader>
						<CardContent className="pl-2">
							<Overview data={graphRevenue} />
						</CardContent>
					</Card>
					<Card className="col-span-3">
						<CardHeader>
							<CardTitle>Recent Sales</CardTitle>
							<CardDescription>You made 265 sales this month.</CardDescription>
						</CardHeader>
						<CardContent>
							<RecentSales data={recentSales} />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
