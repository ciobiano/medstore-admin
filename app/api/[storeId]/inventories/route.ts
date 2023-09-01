import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const {
			name,
			price,
			stock,
			categoryId,
			manufacturerId,
			sizeId,
			images,
			isFeatured,
			isOutOfStock,
			description,
		} = body;

		

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 403 });
		}

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}

		if (!images || !images.length) {
			return new NextResponse("Images are required", { status: 400 });
		}

		if (!price) {
			return new NextResponse("Price is required", { status: 400 });
		}
		if (!stock) {
			return new NextResponse("Stock is required", { status: 400 });
		}

		if (!categoryId) {
			return new NextResponse("Category id is required", { status: 400 });
		}

		if (!manufacturerId) {
			return new NextResponse("Color id is required", { status: 400 });
		}

		if (!sizeId) {
			return new NextResponse("Size id is required", { status: 400 });
		}

		if (!params.storeId) {
			return new NextResponse("Store id is required", { status: 400 });
		}

		if (price < 0 || stock < 0) {
			return new NextResponse("Price and stock must be non-negative", {
				status: 400,
			});
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

		const inventories = await prismadb.inventory.create({
			data: {
				name,
				price,
				description,
				stock,
				isFeatured,
				isOutOfStock,
				categoryId,
				manufacturerId,
				sizeId,
				storeId: params.storeId,
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
			},
		});

		return NextResponse.json(inventories);
	} catch (error) {
		console.log("[INVENTORY_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get("categoryId") || undefined;
		const manufacturerId = searchParams.get("manufacturerId") || undefined;
		const sizeId = searchParams.get("sizeId") || undefined;
		const isFeatured =
			searchParams.get("isFeatured") === "true" ? true : undefined;
		const isOutOfStock =
			searchParams.get("isOutOfStock") === "true" ? true : false;

		const limit = parseInt(searchParams.get("limit") || "10");
		const skip = parseInt(searchParams.get("skip") || "0");

		if (!params.storeId) {
			return new NextResponse("Store id is required", { status: 400 });
		}

		const Inventories = await prismadb.inventory.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
				manufacturerId,
				sizeId,
				isFeatured,
				isOutOfStock,
			},
			include: {
				images: true,
				category: true,
				manufacturer: true,
				size: true,
			},
			take: limit,
			skip,
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(Inventories);
	} catch (error) {
		console.log("[INVENTORY_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
