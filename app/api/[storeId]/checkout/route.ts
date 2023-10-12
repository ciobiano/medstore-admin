import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

interface CartItem {
	id: string;
	quantity: number;
}

interface CartPayload {
	items: CartItem[];
}

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
	return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	const payload: CartPayload = await req.json();
	const inventoryIds = payload.items.map((item) => item.id);
	const quantities = payload.items.map((item) => item.quantity);

	if (!inventoryIds || inventoryIds.length === 0) {
		return new NextResponse("Missing inventory id", { status: 400 });
	}

	const inventories = await prismadb.inventory.findMany({
		where: {
			id: {
				in: inventoryIds,
			},
		},
	});

	const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

	inventories.forEach((inventory, index) => {
		if (typeof quantities[index] === "number") {
			// Ensure quantity is a number
			line_items.push({
				quantity: quantities[index],
				price_data: {
					currency: "NGN",
					product_data: {
						name: inventory.name,
					},
					unit_amount: inventory.price.toNumber() * 100,
				},
			});
		}
	});

	const order = await prismadb.order.create({
		data: {
			storeId: params.storeId,
			isPaid: false,
			quantity: quantities[0],

			orderItems: {
				create: inventoryIds.map((inventoryId: string, index: number) => ({
					inventory: {
						connect: {
							id: inventoryId,
						},
					},
					quantity: quantities[index],
				})),
			},
		},
	});

	const session = await stripe.checkout.sessions.create({
		line_items,
		mode: "payment",
		billing_address_collection: "required",
		phone_number_collection: {
			enabled: true,
		},
		
		success_url: `${process.env.FRONTEND_STORE_URL}/search?success=1`,
		cancel_url: `${process.env.FRONTEND_STORE_URL}/search?canceled=1`,
		metadata: {
			quantities: JSON.stringify(quantities),
			orderId: order.id,
		},
	});

	return NextResponse.json(
		{ url: session.url },
		{
			headers: corsHeaders,
		}
	);
}
