import { AUTH } from '../constants/actionTypes';
import * as api from '../api'; //import everything from api's fetchPosts an use as api

//Sign In
//Nb when exporting asynchronous actions we make use of redux thunk (multi arrow functions)
export const signin = ( formData, history) => async (dispatch) => {
    try{//try this if the signin is sent to the server... else catch this
        const { data } = await api.signIn(formData);

        dispatch({ type: AUTH, data });

        history.push('/') //when a user logs in he is pushed to the homepage 
    }
    catch(error){
        console.log(error)
    }
}

//Sign Out
export const signup = ( formData, history) => async (dispatch) => {
    try{//try this if the signin is sent to the server... else catch this
        const { data } = await api.signUp(formData);

        dispatch({ type: AUTH, data });
        
        history.push('/') //when a user logs out he is pushed to the homepage 
    }
    catch(error){
        console.log(error)
    }
}