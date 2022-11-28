import { START_LOADING, END_LOADING, FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH, CREATE, UPDATE, DELETE, LIKE, COMMENT } from '../constants/actionTypes';

//a reducers accepts a state and an action hence listens to the type of action and executes what that action is defined to do!
export default(state = [], action) => { //NB: the state is always going to be equals to something 
    switch(action.type){
        case START_LOADING:
            return{ ...state, isLoading: true};
        case END_LOADING:
            return { ...state, isLoading: false};
        case DELETE:
            //keeping all the id except the one where id doesnt equal action.payload 
            return state.filter((post) => post._id !== action.payload );
        case UPDATE:
            //if post.id equals the payload._id(specific data wrt to id) return the payload._id else return the post as it were 
            return state.map((post) => (post._id === action.payload._id ? action.payload : post));
        case FETCH_ALL:
            return{ //destructe every item being called by the fetch action(getPosts)
                ...state,
                posts: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages
            }; 
        case FETCH_POST: {
            return { ...state, post: action.payload };
        };
        case LIKE: {
            return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post))}
        };
        case COMMENT: {
            return { 
                ...state,
                posts: state.posts.map((post) => {
                    //Return all posts normally but change the post recieving comment
                    if(post._id === action.payload._id){
                        //return the post recieving comment 
                        return action.payload;
                    }

                    //return all other posts normally 
                    return post;
                })
            }
        };
        case FETCH_BY_SEARCH:
            return { ...state, posts: action.payload }; 
        case CREATE: 
            //The spread operator adds incoming value of an array to itself, NB: the action.payload holds the data  
            return {...state, posts: [...state.posts, action.payload]};
        default:
            return state;  
    }
}