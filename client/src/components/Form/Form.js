import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts'

const Form = ({ currentId, setCurrentId }) => {
    //The postData holds the value of the value of every data created in the form/can be adjusted due to Reacts useState
    const [postData,  setPostData] = useState({title:'', message:'', tags:'', selectedFile:''});

    //fetching data for specific post on click of the moreHorizonIcon 
    const post = useSelector((state) => currentId ? state.posts.posts.find((p) => p._id === currentId) : null); //double post to find specific post
    const dispatch = useDispatch(); //This allows us to dispatch an action (i.e from actions/posts folder)
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'))
    const history = useHistory();

    const clear = () => {
        setCurrentId(0);
        setPostData({ title:'', message:'', tags: [], selectedFile:'' })
    }

    useEffect(() => {
        if(post) setPostData(post)
    }, [post]) //dependecy array determines what changes for useEffect to be active


    const handleSubmit = (e) => {
        //The dispatch action is then called by the handle submit to move this data to the backend on click of submit button 
        e.preventDefault(); //prevents event refresh 

        if(currentId === 0){
            dispatch(createPost({ ...postData, name: user?.result?.name}, history)) //optionalChaining(?.) checks if the user has a name at the localStorage
            clear()
        }else{
            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name}));
            clear()
        };
    };

    if(!user?.result?.name){
        return(
            <Paper className={ classes.paper }>
                <Typography variant="h6" align="center">
                    Please Sign in to create your own memories 
                </Typography>
            </Paper>
        )
    };
  

    return (  
        <Paper className={classes.paper}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{ currentId ? 'Editing' : 'Creating'} A Memory</Typography>      
                <TextField 
                    name="title" 
                    variant="outlined" 
                    label="Title" 
                    fullWidth 
                    value={postData.title} 
                    onChange={(e) => setPostData({ ...postData, title: e.target.value})} 
                />

                <TextField 
                    name="message" 
                    variant="outlined" 
                    label="Message" 
                    fullWidth 
                    multiline 
                    rows={2}
                    value={postData.message} 
                    onChange={(e) => setPostData({ ...postData, message: e.target.value})} 
                />

                <TextField 
                    name="tags" 
                    variant="outlined" 
                    label="Tags" 
                    fullWidth 
                    value={postData.tags} 
                    onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} 
                />

                <div className={classes.fileInput}>
                    <FileBase
                        type="file"
                        multiple={false}
                        onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64})}
                    />
                </div>

                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <Button  variant="contained" color="secondary" size="small" onClick={clear} fullWidth>CLEAR</Button>
            </form>
        </Paper>
    );
}
 
export default Form;