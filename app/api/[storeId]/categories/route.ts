import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { triggerRevalidation } from "@/lib/revalidate";

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const { name, billboardId } = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 403 });
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}

		if (!billboardId) {
			return new NextResponse("Billboard ID is required", { status: 400 });
		}

		if (!params.storeId) {
			return new NextResponse("Store id is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 405 });
		}

		const category = await prismadb.category.create({
			data: {
				name,
				billboardId,
				storeId: params.storeId,
			},
		});
		await triggerRevalidation("categories");

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		if (!params.storeId) {
			return new NextResponse("Store id is required", { status: 400 });
		}

		const category = await prismadb.category.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		await triggerRevalidation("categories");

		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
