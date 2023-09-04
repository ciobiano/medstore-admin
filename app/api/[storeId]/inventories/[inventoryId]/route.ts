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
				size: true,
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
		});1

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
			sizeId,
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

        if(!stock){
            return new NextResponse("Stock is required", { status: 400 })
        }

        if(!description){
            return new NextResponse("Description is required", { status: 400 })
        }

		if (!sizeId) {
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
				sizeId,
				images: {
					deleteMany: {},
				},
				isFeatured,
				isOutOfStock,
			},
		});

		const inventories = await prismadb.inventory.update({
			where: {
				id: params.inventoryId,
			},
			data: {
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
			},
		});

		return NextResponse.json(inventories);
	} catch (error) {
		console.log("[INVENTORY_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
