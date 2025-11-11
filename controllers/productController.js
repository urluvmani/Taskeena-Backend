import fs from "fs";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createProductController = async (req, res) => {
  try {
   const { name, description, price, quantity, category, shipping, discountPercent } = req.fields;

    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });

      case !description:
        return res.status(500).send({ error: "description is Required" });

      case !price:
        return res.status(500).send({ error: "price is Required" });

      case !category:
        return res.status(500).send({ error: "category is Required" });

      case !quantity:
        return res.status(500).send({ error: "quantity is Required" });

      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "quantity is Required" });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name), discountPercent: discountPercent || 0 });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (error) {
    res.status(500).send({ error: "Error in creating Product" });
  }
};
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(201).send({
      success: true,
      total_products: products.length,
      message: "All Products are here...",
      products,
    });
  } catch (error) {
    res.status(500).send({
      message: "error in getting products",
    });
  }
};
export const SingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo");
    res.status(201).send({
      success: true,
      message: "Products is here...",
      product,
    });
  } catch (error) {
    res.status(500).send({
      message: "error in getting product",
    });
  }
};
export const productPhotoController = async (req, res) => {
  try {
    const productPhoto = await productModel
      .findById(req.params.pid)
      .select("photo");
    if (productPhoto.photo.data) {
      res.set("Content-Type", productPhoto.photo.contentType);
      res.set("Cache-Control", "public, max-age=31536000");
      return res.status(200).send(productPhoto.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      message: "error in getting photo",
    });
  }
};
export const productUpdateController = async (req, res) => {
  try {
   const { name, description, price, quantity, category, shipping, discountPercent } = req.fields;

    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !price:
        return res.status(500).send({ error: "Price is required" });
      case !category:
        return res.status(500).send({ error: "Category is required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "Photo should be less than 1MB" });
    }

    const products = await productModel.findByIdAndUpdate(
  req.params.pid,
  { ...req.fields, slug: slugify(name), discountPercent: discountPercent || 0 },
  { new: true }
);


    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);

      products.photo.contentType = photo.type;
    }

    await products.save();

    res.send({
      success: true,
      message: "Product updated successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};

export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    const args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }
    const products = await productModel.find(args).select("-photo");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in filtering",
    });
  }
};
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).select("-photo").estimatedDocumentCount();
    res.send({
      success: true,
      total,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
export const productlistController = async (req, res) => {
  try {
    const perpage = 4;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .sort({ createdAt: -1 }); // fixed

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in product pagination",
      error,
    });
  }
};
export const productSearchController = async (req, res) => {
  try {
    const { keyword } = req.params;

    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Searching product",
      error,
    });
  }
};

// relatedProductController
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const relatedproducts = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.send({
      success: true,
      relatedproducts,
    });
  } catch (error) {
    res.status(500).send({
      message: "error in gettin relatedProducts",
    });
  }
};
export const CategoryProductController= async(req,res)=>{
  try {
    const category = await categoryModel.findOne({slug:req.params.slug})
    const products = await productModel.find({category}).select("-photo").populate("category")
    res.send({
      success:true,
      message: "Successfully getting category products",
      category,
      products
    })
  } catch (error) {
    res.status(500).send({
      message: "error in getting category products",
    });
  }
}
export const DeleteProductController= async(req,res)=>{
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.pid).select("-photo")
    res.send({
      success:true,
      message: "Product Deleted Successfully",
      deletedProduct
    })
  } catch (error) {
    res.status(500).send({
      message: "error in deleting product",
    });
  }
}
