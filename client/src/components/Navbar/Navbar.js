import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Typography, Toolbar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import decode from 'jwt-decode'
import memoriesLogo from '../../images/memoriesLogo.png';
import memoriesText from '../../images/memoriesText.png';
import useStyles from './styles.js';

const Navbar = () => {
    const classes = useStyles();
    //useState gets a user immediately from the localstorage in google hence data is parsed(Parse is used fro converting stringified data) before entering the callPoint
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile'))); 
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const logout = () => {
        dispatch({ type: 'LOGOUT' });

        history.push('/');

        //When someone log out user is null
        setUser(null);
    }

    //Tells when User token is Expired...
    useEffect(() => { //Checks if the token exists using optionalChaining(?.) 
        const token = user?.token;

        if(token){
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        //JWT to be used for manual signIn 
        
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location])
    
    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <Link to="/" className={classes.brandContainer}>
                <img src={memoriesText} alt="icon" height="45px" />
                <img className={classes.image} src={memoriesLogo} alt="memories" height="40px" /> 
            </Link> 

            <Toolbar className={ classes.toolbar }>
                { user ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
                        <Typography className={classes.userName} variant="h6"> {user.result.name} </Typography>
                        <Button variant="contained" className={classes.logout} color="secondary" onClick={logout} >Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
            )}
            </Toolbar>
        </AppBar>
    );
}
 
export default Navbar;