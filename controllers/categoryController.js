import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
export const createCategoryController = async (req, res) => {
  try {
    const { name } = await req.body;
    if (!name) {
      return res.status(400).send({
        message: "name is required",
      });
    }
    const existingcategory = await categoryModel.findOne({ name });
    if (existingcategory) {
      return res.send({
        success: false,
        message: "Category already exists",
      });
    }
    const Category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "created category type",
      Category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in creating category type",
    });
  }
};
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = await req.body;
    const { id } = await req.params;
  const category = await categoryModel.findByIdAndUpdate(
  id,
  { name, slug: slugify(name) },
  { new: true }
);

    res.send({
        success:true,
        message:"category Updated Successfully",
        category
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in creating category type",
    });
  }
};
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
   await categoryModel.findByIdAndDelete(
  id
);

    res.send({
        success:true,
        message:"category Deleted Successfully",
        
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting category type",
    });
  }
};
export const getCategoryController = async (req, res) => {
  try {
   const AllCategory = await categoryModel.find({});

    res.send({
        success:true,
        message:"All Category Showed Successfully",
        AllCategory
        
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Showing categories",
    });
  }
};
export const getOneCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
   const Category = await categoryModel.findOne({slug});

    res.send({
        success:true,
        message:"Category Showed Successfully",
        Category
        
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Showing categories",
    });
  }
};
