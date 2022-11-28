import React, { useEffect } from 'react';
import { Paper, Typography, CircularProgress, Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment'; //js library for time
import { useParams, useHistory } from 'react-router-dom';
import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from './CommentSection.jsx';

import useStyles from './styles' 


const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();  //singlePost is created based on corresponfing id

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  useEffect(() => {
    if(post)
    dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',')}))
  }, [post])

  //Prevents undefined by checking if condition for rendering data below is right 
  if(!posts) return null; 

  if(isLoading){
    return <Paper elevation={6} className={classes.LoadingPaper}>
      <CircularProgress size="7em"/>
    </Paper>
  };

  const recommendedPosts = posts.filter(({ _id }) => _id !== posts._id); //return an object containing all posts id that != currents post id 

  const openPost = (_id) => history.push(`posts/${_id}`);

  return(
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">Created by:{post.name}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: "20px 0"}} />
          <CommentSection post={post} />
          <Divider style={{ margin: '20px 0'}} />
        </div>
        <div className={classes.imageSection}>
          <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
        </div>
      </div>
      {!!recommendedPosts.length && ( // !! coverts a non boolean to a boolean 
        <div className={classes.section}>
          <Typography gutterBottom variant="h5"> You may also like? </Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(({title, message, name, likes, selectedFile, _id}) => (
              <div style={{ margin: "20px", cursor: "pointer" }} onClick={() => openPost(_id)} key={_id}>
                <Typography gutterBottom variant="h6">{title}</Typography>
                <Typography gutterBottom variant="subtitle2">{name}</Typography>
                <Typography gutterBottom variant="subtitle2">{message}</Typography>
                <Typography gutterBottom variant="subtitle1">Likes: {likes.length}</Typography>
                <img src={selectedFile} width="200px"/>
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
  )
}

export default PostDetails;