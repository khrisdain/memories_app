import { AUTH, LOGOUT } from '../constants/actionTypes';

const authReducer = (state = { authData: null }, action) => { //State is originally empty
    switch (action.type){
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));//set 'profile' with the data from second argumnet 

            return { ...state, authData: action?.data }; //spread Operator takes in the value of auth data in state
        
        case LOGOUT:
            localStorage.clear(); //rhetorical[ clears out the local storage ]

            return { ...state, authData: null };
        default:
            return state;
    }
};

export default authReducer;