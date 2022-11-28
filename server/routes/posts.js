import express from 'express';

//destructured because we arent importing a default
import { getPost, getPosts, getPostsBySearch, createPost, updatePost, deletePost, likePost, commentPost } from '../controllers/posts.js'

import auth from '../middleware/auth.js';
const router = express.Router();

//auth is implemented in each route that a user require authentication before a certain action can be done 
router.get('/search', getPostsBySearch)
router.get('/', getPosts); // get all posts
router.get ('/:id', getPost)

router.post('/',auth, createPost); //create a new post
router.patch('/:id', auth, updatePost) //basically for editing eg updating
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', auth, commentPost)

export default router;