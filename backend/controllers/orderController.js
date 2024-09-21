import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../Models/orderModel.js";

//@desc fetch all products
//@route get/api/products
//@access private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress, // Correct spelling here
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No Order Items");
  } else {
    // Create a new order instance with the correct shippingAddress
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined, // Remove _id to avoid duplicating
      })),
      user: req.user._id,
      shippingAddress, // Correct spelling here
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Save the order instance
    const createOrder = await order.save(); // Save the instance

    // Send the created order back to the client
    res.status(201).json(createOrder);
  }
});

//@desc get lodded in user orders
//@route get/api/orders/myorders
//@access private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(400);
    throw new Error("No Order found");
  }
});
//@desc update order is paid or not
//@route put/api/orders/:id/pay
//@access private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentReşult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(400);
    throw new Error("No Order found");
  }
});

//@desc update order is paid or not
//@route get/api/orders/myorders
//@access private
const updateDelivered = asyncHandler(async (req, res) => {
  res.send("update orders delivered");
});

//@desc update order is paid or not
//@route get/api/orders/myorders
//@access private
const getAllOrders = asyncHandler(async (req, res) => {
  res.send("get all orders");
});

//@desc update order is paid or not
//@route get/api/orders/myorders
//@access private
const getOrders = asyncHandler(async (req, res) => {
  res.send("get all orders");
});

export {
  addOrderItems,
  getMyOrders,
  updateOrderToPaid,
  updateDelivered,
  getAllOrders,
  getOrders,
  getOrderById,
};
