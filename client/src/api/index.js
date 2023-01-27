import axios from 'axios';

const API = axios.create({ baseURL: 'https://erin-upset-fawn.cyclic.app'});

//required for backend authorization middleware to work 
//NB: the interceptors most occur before the request is carried out by other crud functions becuase this sends a token to the backend to validate the user 
API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')){ //localStorage contains holds the token
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;  //token has to be a template string and begin with the word Bearer
    }
    
    return req; 
});

//implement redux in all posts method 
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost) //axios updating url with a particular id e.g localhost:5000/posts/_id:id from mongoose
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value }) //Value at the end is an object containg data from the backend  

//sign in & sign out routes
export const signIn = (formData) => API.post('/users/signin', formData);
export const signUp = (formData) => API.post('/users/signup', formData);
