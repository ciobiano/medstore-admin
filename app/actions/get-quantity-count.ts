import prismadb from "@/lib/prismadb";

export const getTotalInventoryStock = async (storeId: string) => {
    const inventoryItems = await prismadb.inventory.findMany({
        where: {
             storeId,
         
        },
    });
    const totalStock = inventoryItems.reduce((acc, item) => acc + item.stock, 0);
    return totalStock;
};