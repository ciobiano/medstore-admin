const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteOrders() {
	 try {
    // First, delete all OrderItems
    const deletedOrderItems = await prisma.orderItem.deleteMany({});

    console.log('Deleted order items:', deletedOrderItems);

    // After deleting OrderItems, you can safely delete all Orders
    const deletedOrders = await prisma.order.deleteMany({});

    console.log('Deleted orders:', deletedOrders);
  } catch (error) {
    console.error('Error deleting orders and order items:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}


deleteOrders();
