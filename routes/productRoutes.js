import express from 'express';
import expressFormidable from 'express-formidable';

import { isAdmin, requiresignin } from '../middleware/authMiddleware.js';
import { createProductController,CategoryProductController,DeleteProductController,relatedProductController,productSearchController,productlistController,productUpdateController,productFilterController ,getProductController,SingleProductController,productPhotoController, productCountController} from '../controllers/productController.js';

const router = express.Router();

router.post("/create-product", requiresignin, isAdmin, expressFormidable(), createProductController)
router.get("/get-product",getProductController)
router.get("/get-product/:slug",SingleProductController)
router.get("/product-photo/:pid",productPhotoController)
router.post("/product-update/:pid", requiresignin, isAdmin, expressFormidable(), productUpdateController);
router.post("/product-filters" , productFilterController)
router.get("/product-count" , productCountController)
router.get("/product-page/:page" , productlistController)
router.get("/search/:keyword" , productSearchController)
router.get("/related-products/:pid/:cid" , relatedProductController)
router.get("/category-product/:slug" , CategoryProductController)
router.delete("/delete-product/:pid", requiresignin, isAdmin, DeleteProductController)


export default router;