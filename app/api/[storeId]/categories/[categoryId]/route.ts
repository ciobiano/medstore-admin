import prismadb from "@/lib/prismadb";
import { triggerRevalidation } from "@/lib/revalidate";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	{ params }: { params: { categoryId: string } }
) {
	try {
		if (!params.categoryId) {
			return new NextResponse("Category Id is required", { status: 400 });
		}

		const category = await prismadb.category.findUnique({
			where: {
				id: params.categoryId,
			},
			include: {
				billboard: true,
			},
		});
		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_GET_ERROR]", error);
		return new NextResponse("Something went wrong", { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { name, billboardId } = body;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}
		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}
		if (!params.categoryId) {
			return new NextResponse("Category Id is required", { status: 400 });
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
		const category = await prismadb.category.updateMany({
			where: {
				id: params.categoryId,
			},
			data: {
				name,
				billboardId,
			},
		});
		await triggerRevalidation("categories");
		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_PATCH_ ERROR]", error);
		return new NextResponse("Something went wrong", { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!params.categoryId) {
			return new NextResponse("Category Id is required", { status: 400 });
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
		const category = await prismadb.category.deleteMany({
			where: {
				id: params.categoryId,
			},
		});
		await triggerRevalidation("categories");
		return NextResponse.json(category);
	} catch (error) {
		console.log("[CATEGORY_DELETE_ERROR]", error);
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
