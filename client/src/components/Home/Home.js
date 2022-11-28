import React, {useState, useEffect} from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux'; //allows us to dispatch an action 
import { useHistory, useLocation } from 'react-router-dom';//useHistory allows renavigation of app e.g (searching) & useLocation let us know what page we on currently;
import { getPostsBySearch } from '../../actions/posts';


import Form from '../Form/Form.js'
import Posts from '../Posts/Posts.js'
import Pagination from '../Pagination';
import useStyles from './styles'
import ChipInput from 'material-ui-chip-input';

function useQuery() { //Reacts-router-dom function 
    return new URLSearchParams(useLocation().search); 
}

const Home = () => {
    const [ currentId, setCurrentId ] = useState(null);
    const [ search, setSearch ] = useState('') //empty string
    const [ tags, setTags ] = useState([])
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = useQuery();
    const history = useHistory();
    const page = query.get('page') || 1; //gets the page info 

    const searchPost = () => {
        if(search.trim() || tags){
            dispatch(getPostsBySearch({ search, tags: tags.join(',')})); //tags.join(',') is used as an array cant be passed through a url call point  
        
            history.push(`/posts/search?searchQuery= ${search || 'none'}&tags=${tags.join(',')}`)
        } else {
            history.push('/');
        }
    };

    const handleKeyPress = (e) => {//handles logic for the search bar 
        if(e.keyCode === 13){ //Nb: key code 13 is the enter key 
            searchPost(); 
        }
    }

    const handleAdd = (tag) => setTags([...tags, tag])

    const handleDelete = (tagsToDelete) => setTags(tags.filter((tags) => tags !== tagsToDelete))

    return (  
        <Grow in>
        <Container>
            <Grid container justifyContent="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
                <Grid item xs={12} sm={6} md={9}>
                    <Posts setCurrentId={setCurrentId} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <AppBar className={classes.appBarSearch} position="static" color="inherit">
                        <TextField 
                        name="search"
                        variant="outlined"
                        label="Search Memories"
                        onKeyPress={ handleKeyPress }
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        />     

                        <ChipInput 
                            style={{ margin: '10px 0'}}
                            value={tags}
                            onAdd={handleAdd}
                            onDelete={handleDelete}
                            label="Search tags"
                            variant="outlined"
                        />        
                        <Button onClick={searchPost} className={classes.searchButton}color="primary" variant="contained">
                            Search
                        </Button>
                    </AppBar>

                    <Form currentId={currentId} setCurrentId={setCurrentId} />
                    <Paper elevation={6}>
                        <Pagination page={page}/>
                    </Paper>
                </Grid>
            </Grid> 
        </Container>
    </Grow>
    );
}
 
export default Home;