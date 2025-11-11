import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: Object,
        required: true,
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId, // ✅ correct schema ref
      ref: "users",
      required: true,
    },
    buyeraddress: {
      type: String,
      required: true,
    },
    buyerphone: {
      type: String,
      default: "",
    },
    transactionId: {
      type: String,
      default: "",
    },
    status:{
        type:String,
        enum:["Not Processed","Processing","Shipped","Delivered","Cancelled"],
        default:"Not Processed"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
