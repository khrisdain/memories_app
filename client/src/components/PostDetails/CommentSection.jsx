import React, { useState, useRef} from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyles from './styles.js';

//imports the comment Post actions
import { commentPost } from '../../actions/posts.js';

const CommentSection = ({ post }) => { //passed as prop from postDetails
    const classes = useStyles();
    const [comments, setComments] = useState(post?.comments)
    const [comment, setComment] = useState('');
    const user = JSON.parse(localStorage.getItem('profile')); //populates user details (key: profile    );
    const dispatch = useDispatch();
    const commentsRef = useRef();

    const handleClick = async() => {//code for submitting comment
        const finalComment = `${user.result.name}: ${comment}`; //renders comment alongside signed in user's name
        
        const newComments = await dispatch(commentPost(finalComment, post._id));

        setComments(newComments); //Takes the newComments and immediately renders it to the screen 
        setComment(''); //set singular comment into an empty string to clear it out 

        //functionality to scroll down automatically(useRef)
        commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return(
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments</Typography>
                    {comments.map((c, i) => ( /*multiple variables used to map where c is the current element and i the element index */
                        <Typography key={i} gutterBottom variant="subtitle1"> 
                            <strong>{c.split(': ')[0]}</strong>
                            {c.split(':')[1]}
                        </Typography>
                    ))}
                </div>
                <div ref={commentsRef} />
                <div style={{ width: '70%' }}>
                    <Typography ggutterBottom variant="h6"> Write a Comment</Typography>
                    <TextField  fullWidth rows={4} variant="outlined" label="Comment" multiline value={comment} onChange = {(e) => setComment(e.target.value)} />
                    <br />

                    <Button style={{ marginTop: '10px'}} fullWidth disabled={!comment} variant= "contained" color="primary" onClick ={handleClick}>
                        Comment
                    </Button>
                </div>
            </div>
        </div>
    )
};

export default CommentSection; 