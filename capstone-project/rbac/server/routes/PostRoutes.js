import express from 'express';
import { authenticate } from '../middleware/AuthMiddleware.js';
import { authorize } from '../middleware/RoleMiddleware.js';
import { createPost, getPosts, updatePost, deletePost } from '../controllers/PostController.js';

const router = express.Router();

router.get('/', authenticate, authorize('Admin', 'Editor', 'Viewer'), getPosts);
router.post('/', authenticate, authorize('Admin', 'Editor'), createPost);
router.put('/:id', authenticate, authorize('Admin', 'Editor'), updatePost);
router.delete('/:id', authenticate, authorize('Admin'), deletePost);

export default router;
