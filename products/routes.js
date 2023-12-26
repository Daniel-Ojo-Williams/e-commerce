import express from 'express';
import { addNewProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from './controller.js';

const router = express.Router();

router.route('/new').post(addNewProduct);
router.route('/allProducts').get(getAllProducts);
router.route('/:productId').get(getProduct).put(updateProduct).delete(deleteProduct);





export default router