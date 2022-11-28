import React, {Fragment, useState} from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { signin, signup } from '../../actions/auth';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import useStyles from './styles.js';


const initialState = { firstName: '', lastName:'', email:'', password:'', confirmPassword:''};

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const history = useHistory();
    
    //Toggle Password State
    const handleShowPassword= () => setShowPassword((prevShowPassword) => !prevShowPassword);

    //handlesubmit for the sign up
    const handleSubmit = (e) => {
      e.preventDefault(); //reacts refreshes automatically on form submit 

      if (isSignup){
        dispatch(signup(formData, history));
      }
      else{
        dispatch(signin(formData, history));
      }
    };

    const handleChange = (e) => { //populates login form with data 
      setFormData({ ...formData, [e.target.name]: e.target.value});//add the target value of each targetName defined in the form
    };

    //SwitchMode from signUp to signIn
    const switchMode = () => {
      setIsSignup((prevIsSignUp) => !prevIsSignUp) //Futher read on react previousState
      setShowPassword(false); //changes the state of showPassWord from true
    }

    const googleSuccess =  async(res) => {
      var decoded = jwt_decode(res.credential);
      console.log(decoded)

      const result = res?.profileObj;
      const token = res?.tokenId;
  
      try {
        dispatch({ type: AUTH, data: { result, token } });
  
        history.push('/');
      } catch (error) {
        console.log(error);
      }
    };

    const googleError = () => {
      console.log("Google sign in was unsucessful, try again later");
    }

  return (
    <Container component="main" maxWidth="xs"> {/*Create login Avatar */}
      <Paper className={ classes.paper } elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon /> 
        </Avatar>

        {/*Sign In */}
        <Typography variant="h5">{ isSignup ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={ classes.form } onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            { isSignup && (
                <Fragment>
                  <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="LastName" label="Last Name" handleChange={handleChange} half />
               </Fragment>
            )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
            {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
          </Grid>

          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
          {isSignup ? 'Sign Up' : 'Sign In'}
          </Button>

          <GoogleLogin
            className={classes.googleButton}
            fullWidth
            onSuccess={googleSuccess}
          />

          <Grid container justify="flex-end">
              <Grid item>
                <Button onClick={switchMode}>
                  { isSignup ? 'Already have an account? Sign In' : 'Dont have an account Sign up'}
                </Button>
              </Grid>
          </Grid>
        </form> 
      </Paper>
    </Container>
  )
}

export default Auth; 