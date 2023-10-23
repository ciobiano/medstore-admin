import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatter } from '@/lib/utils';

export type OrderColumn = {
	id: string;
    email: string;
	phone: string;
	address: string;
	createdAt: string;
    amount:  string | number;
};

interface RecentSalesProps {
    data: OrderColumn[];
}
export const RecentSales: React.FC<RecentSalesProps>=({data})=> {
	return (
<div className="space-y-8">
    {data.slice(-5).map((order) => (
        <div className="flex items-center" key={order.id}>
            <Avatar className="h-9 w-9">
                <AvatarImage src="/avatar.png" alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{order.email}</p>
                <p className="text-sm text-muted-foreground">{order.phone}</p>
            </div>
        <div className="ml-auto font-medium"> <span className="pr-2">+</span>{formatter.format(Number(order.amount))}</div>
        </div>
    ))}
</div>
			
		
	);
}
