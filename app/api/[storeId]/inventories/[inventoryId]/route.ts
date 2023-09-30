import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
	req: Request,
	{ params }: { params: { inventoryId: string } }
) {
	try {
		if (!params.inventoryId) {
			return new NextResponse("Product id is required", { status: 400 });
		}

		const inventories = await prismadb.inventory.findUnique({
			where: {
				id: params.inventoryId,
			},
			include: {
				images: true,
				category: true,
				sizes: true,
				manufacturer: true,
			},
		});

		return NextResponse.json(inventories);
	} catch (error) {
		console.log("[INVENTORY_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { inventoryId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 403 });
		}

		if (!params.inventoryId) {
			return new NextResponse("Product id is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});
		1;

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 405 });
		}

		const inventories = await prismadb.inventory.delete({
			where: {
				id: params.inventoryId,
			},
		});

		return NextResponse.json(inventories);
	} catch (error) {
		console.log("[INVENTORY_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { inventoryId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const {
			name,
			price,
			stock,
			description,
			categoryId,
			images,
			manufacturerId,
			sizeIds,
			isFeatured,
			isOutOfStock,
		} = body;

		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 403 });
		}
		if (!params.inventoryId) {
			return new NextResponse("Product id is required", { status: 400 });
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
		if (!categoryId) {
			return new NextResponse("Category id is required", { status: 400 });
		}
		if (!manufacturerId) {
			return new NextResponse("Manufacturer id is required", { status: 400 });
		}
		if (!stock) {
			return new NextResponse("Stock is required", { status: 400 });
		}
		if (!description) {
			return new NextResponse("Description is required", { status: 400 });
		}
		if (!sizeIds) {
			return new NextResponse("Size id is required", { status: 400 });
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

		// Fetch the actual size IDs based on the size values provided in the payload
		const fetchedSizeIds = await prismadb.size.findMany({
			where: {
				value: {
					in: sizeIds,
				},
			},
			select: {
				id: true,
			},
		});

		const actualSizeIds = fetchedSizeIds.map((size) => size.id);

		if (actualSizeIds.length !== sizeIds.length) {
			return new NextResponse("Some size IDs are invalid", { status: 400 });
		}

		if (price < 0 || stock < 0) {
			return new NextResponse("Price and stock must be non-negative", {
				status: 400,
			});
		}

		await prismadb.inventorySize.deleteMany({
			where: {
				inventoryId: params.inventoryId,
			},
		});

		// Connect new sizes
		await prismadb.inventorySize.createMany({
			data: actualSizeIds.map((sizeId: string) => ({
				inventoryId: params.inventoryId,
				sizeId: sizeId,
			})),
		});

		await prismadb.inventory.update({
			where: {
				id: params.inventoryId,
			},
			data: {
				name,
				price,
				stock,
				description,
				categoryId,
				manufacturerId,
				images: {
					deleteMany: {},
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
				isFeatured,
				isOutOfStock,
			},
		});

		const inventories = await prismadb.inventory.findUnique({
			where: {
				id: params.inventoryId,
			},
			include: {
				images: true,
				category: true,
				sizes: true,
				manufacturer: true,
			},
		});

		return NextResponse.json(inventories);
	} catch (error) {
		console.log("[INVENTORY_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
