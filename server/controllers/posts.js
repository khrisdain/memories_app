import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();
//Get Posts generally
export const getPosts = async(req, res) => { //switch it up to get post by page
    const { page } = req.query; //using the searchQuery parameter to call the API end point 

    try{
        const LIMIT = 6; //No of post per page of pagination 
        const startIndex = (Number(page) - 1) * LIMIT//The Page gets converted to a string in the Querystring hence number constructor is required 
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    }
    catch(error){
        res.status(404).json({ message: error.message });
    }
};

//req.Query -> /posts?page = 1 -> page = 1. therefore one requires the page to fetch 
//PARAMS -> /posts/123 -> id =123 requries id to fetch
export const getPostsBySearch = async(req, res) => {
    const { searchQuery, tags } = req.query

    try{
        const title = new RegExp(searchQuery, 'i' ) //the regex flag 'i' stands for ignore case e.g(TEST, test, tEst) yields same result 

        const message = new RegExp(searchQuery, 'i')

        const posts = await PostMessage.find({ $or: [ {title}, {message},{ tags: { $in: tags.split(',')}}]});

        res.json({ data: posts });
    } catch(error){
        res.status(404).json({ message: error.message })
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//Create a new post
export const createPost = async (req, res) => {
    const post = req.body;
    
    
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })//Nb: now the name of the creator will change from a name to an ID
    
    try{
        await newPost.save();

        res.status(201).json(newPost);
    }
    catch(error) {
        res.status(409).json({ message: error.message });
    }
};


//Updating a post wrt /:ID
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

//Delete a post
export const deletePost = async(req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    await PostMessage.findByIdAndRemove(id);
    
    res.json({ message: 'Post deleted successfully' })
};

//Like Post
export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
}

//Logic forDeleting only a post created by a user and liking only once per user

export const commentPost = async(req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value); //post.comments is picked from mongoose schema

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true}); //options object is the third parameter 

    res.json(updatedPost);
};

export default router; 