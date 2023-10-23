import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { formatter } from "@/lib/utils";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Decimal } from 'decimal.js';

export async function POST(req: Request) {
	const body = await req.text();
	const signature = headers().get("Stripe-Signature") as string;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		);
	} catch (error: any) {
		return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
	}

	const session = event.data.object as Stripe.Checkout.Session;
	const address = session?.customer_details?.address;

	const addressComponents = [
		address?.line1,
		address?.line2,
		address?.city,
		address?.state,
		address?.postal_code,
		address?.country,
	];

	const addressString = addressComponents.filter((c) => c !== null).join(", ");

	if (event.type === "checkout.session.completed") {
		const order = await prismadb.order.update({
			where: {
				id: session?.metadata?.orderId,
			},
			data: {
				isPaid: true,
				address: addressString,
				phone: session?.customer_details?.phone || "",
				email: session?.customer_details?.email || "",
				amount: new Decimal(session?.amount_total || 0).div(100), // convert to Decimal and divide by 100 to get the correct value
			},
			include: {
				orderItems: {
					include: {
						inventory: true,
					},
				},
			},
		});

		await Promise.all(
			order.orderItems.map(async (orderItem) => {
				const inventory = orderItem.inventory;
				const newStock = inventory.stock - orderItem.quantity;

				if (newStock <= 0) {
					await prismadb.inventory.update({
						where: {
							id: inventory.id,
						},
						data: {
							stock: 0,
							isOutOfStock: true,
						},
					});
				} else {
					await prismadb.inventory.update({
						where: {
							id: inventory.id,
						},
						data: {
							stock: newStock,
						},
					});
				}
			})
		);
	}

	return new NextResponse(null, { status: 200 });
}
