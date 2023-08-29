import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	{ params }: { params: { manufacturerId: string } }
) {
	try {
		if (!params.manufacturerId) {
			return new NextResponse("Manufacturer Id is required", { status: 400 });
		}

		const manufacturer = await prismadb.manufacturer.findUnique({
			where: {
				id: params.manufacturerId,
			},
		});
		return NextResponse.json(manufacturer);
	} catch (error) {
		console.log("[MANUFACTURER_GET_ERROR]", error);
		return new NextResponse("Something went wrong", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; manufacturerId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { name } = body;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		if (!name) {
			return new NextResponse("name is required", { status: 400 });
		}
		if (!params.manufacturerId) {
			return new NextResponse("Manufacturer Id is required", { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 403 });
		}
		const manufacturer = await prismadb.manufacturer.updateMany({
			where: {
				id: params.manufacturerId,
			},
			data: {
				name,
				
			},
		});
		return NextResponse.json(manufacturer);
	} catch (error) {
		console.log("[MANUFACTURER_PATCH_ ERROR]", error);
		return new NextResponse("Something went wrong", { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; manufacturerId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!params.manufacturerId) {
			return new NextResponse("Manufacturer Id is required", { status: 400 });
		}
		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse("Unauthorized", { status: 403 });
		}
		const manufacturer = await prismadb.manufacturer.deleteMany({
			where: {
				id: params.manufacturerId,
			},
		});
		return NextResponse.json(manufacturer);
	} catch (error) {
		console.log("[MANUFACTURER_DELETE_ERROR]", error);
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
