import { START_LOADING, FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH, CREATE, DELETE, END_LOADING, UPDATE, LIKE, COMMENT} from '../constants/actionTypes';
import * as api from '../api'; //import everything from api's fetchPosts an use as api

//Action Creators
export const getPost = (id) => async(dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPost(id);
    
    dispatch({ type: FETCH_POST, payload: data});
    dispatch({ type: END_LOADING }); 
  }
  catch(error){
    console.log(error)
  }
};

export const getPosts = (page) => async(dispatch) => { //The redux thunk allows an extra function in an arrow function e.g function of a function
    try{
        const { data } = await api.fetchPosts(page);
        
        dispatch({ type: FETCH_ALL, payload: data })
    }catch(error){
        console.log(error)
    }
};
  
export const getPostsBySearch = (searchQuery) => async(dispatch) => {
  try{
    const { data: { data } } = await api.fetchPostsBySearch(searchQuery);

    dispatch({ type: FETCH_BY_SEARCH, payload: data })
  } catch(error){
    console.log(error)
  }
}

//const action = { type: 'FETCH_ALL', payload: [] } //actions contains a type and payload and the action creators allows the creation of an ction 

//Create Posts
export const createPost = (post, history) => async (dispatch) => {
    try {
      dispatch({ type: START_LOADING });
      const { data } = await api.createPost(post);
      
      history.push(`/posts/${data._id}`)

      dispatch({ type: CREATE, payload: data });
    } catch (error) {
      console.log(error);
    }
};

//Updating Posts
export const updatePost = (id, post) => async(dispatch) => { 
    try{
      const{data} = await api.updatePost(id, post);

      dispatch({ type: UPDATE, payload: data });
    }
    catch(error){
      console.log(error);
    }
};


//Deleting Post
export const deletePost = (id) => async(dispatch) => {
  try{
    await api.deletePost(id);

    dispatch({ type: DELETE, payload: id })
  }
  catch(error){
    console.log(error);
  };
}

//Like post
export const likePost = (id) => async(dispatch) => {
  const user = JSON.parse(localStorage.getItem('profile'))

  try{
    const { data } = await api.likePost(id, user?.token);

    dispatch({ type: LIKE, payload: data })
  }
  catch(error){
    console.log(error.message);
  };
};

export const commentPost = (value, id) => async(dispatch) => {
   try{
      const { data} = await api.comment(value, id); 

      dispatch({ type: COMMENT, payload: data});

      return data.comment;
  }
  catch(error){
    console.log(error.message)
}
}