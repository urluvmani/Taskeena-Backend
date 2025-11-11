import crypto from "crypto";
import Order from "../models/orderModel.js";
import userModel from "../models/authModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
export const createOrderController = async (req, res) => {
  try {
    const { cart, totalPrice } = req.body;
    const orderId = "ORDER" + Date.now();

    // ✅ Ensure user is signed in
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // ✅ Get buyer info
    const user = await userModel.findById(req.user._id);

    // ✅ Create new order
    const order = await Order.create({
      products: cart,
      totalAmount: totalPrice,
      buyer: req.user._id,
      buyeraddress: user.address || "N/A",
      buyerphone: user.phone || "N/A",
      paymentStatus: "Pending",
      transactionId: orderId,
    });

    // ✅ Reduce stock for each product in cart
    for (const item of cart) {
      await productModel.findByIdAndUpdate(
        item._id,
        { $inc: { quantity: -1 } }, // Decrease stock by 1
        { new: true }
      );
    }

    // ✅ Simulate payment page (mock)
    const fakeHash = crypto.randomBytes(16).toString("hex");
    const htmlForm = `
      <html><body>
        <h3 style="text-align:center;">Redirecting to Mock Payment Gateway...</h3>
        <form id="mockForm" method="POST" action="${process.env.VITE_API_URL}/api/v1/order/payment-return">
          <input type="hidden" name="status" value="success" />
          <input type="hidden" name="orderId" value="${order._id}" />
          <input type="hidden" name="amount" value="${totalPrice}" />
          <input type="hidden" name="hash" value="${fakeHash}" />
        </form>
        <script>document.getElementById('mockForm').submit();</script>
      </body></html>
    `;

    res.send(htmlForm);
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ message: "Error creating order" });
  }
};
export const paymentReturnController = async (req, res) => {
  try {
    const { status, orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.send("<h2>❌ Order not found!</h2>");

    if (status === "success") {
      order.paymentStatus = "Paid";
      await order.save();
      return res.send(`
        <h2 style="text-align:center;color:green;">✅ Payment Successful (Test Mode)</h2>
        <p style="text-align:center;">Transaction ID: ${order.transactionId}</p>
        <p style="text-align:center;">Amount: PKR ${amount}</p>
      `);
    } else {
      order.paymentStatus = "Failed";
      await order.save();
      return res.send(`
        <h2 style="text-align:center;color:red;">❌ Payment Failed (Test Mode)</h2>
        <p style="text-align:center;">Transaction ID: ${order.transactionId}</p>
      `);
    }
  } catch (err) {
    console.error("Payment Return Error:", err);
    res.status(500).json({ message: "Error in payment return" });
  }
};

export const GetOrderController = async (req, res) => {
  try {
    // const user = await userModel.findById(req.user._id);
    const Orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo").populate("buyer","name")
      res.json(Orders)
  } catch (error) {
    console.error("getiing orderlist Error:", err);
    res.status(500).json({ message: "Error in getting orders list" });
  }
};


export const GetAllOrderController = async (req, res) => {
  try {
    const Orders = await orderModel.find({})
      .populate("buyer", "name email phone address") // ✅ Populate buyer details
      .sort({ createdAt: -1 });
     res.send({
      success:true,
      Orders
     })
  } catch (error) {
    console.error("getiing All orderlist Error:", err);
    res.status(500).json({ message: "Error in getting All orders list" });
    
  }
}

// ✅ Update Order Status (Admin Only)
export const UpdateOrderPaymentStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const allowedStatuses = ["Pending", "Paid", "Failed"];
    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({ success: true, message: "Order Payment status updated", order });
  } catch (error) {
    console.error("Error updating order Payment status:", error);
    res.status(500).json({ success: false, message: "Server error while updating Payment status" });
  }
};
export const UpdateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Server error while updating status" });
  }
};


export const DeleteOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    } 
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) { 
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Server error while deleting order" });
  }
};

export const HasPurchasedController = async (req, res) => {

  try {
    const order = await Order.findOne({
      buyer: req.user._id,
      "products._id": req.params.productId,
      paymentStatus: "Paid",
    });
    res.json({ hasPurchased: !!order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}