import {Component, Fragment, useEffect, useState} from 'react'
import {
  Typography,
  Container,
  Chip,
  Stack,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material'
import {Box} from '@mui/system'
import {connect, useDispatch} from 'react-redux'
import {fetchPost, fetchImages, deletePost} from '../../redux/actions/post'
import post from '../../redux/reducers/post'
import {useParams, useNavigate, useSearchParams, useLocation, NavLink} from 'react-router-dom'
import {Navigation, Pagination} from 'swiper'
import {Swiper, SwiperSlide, SwiperPagination} from 'swiper/react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {delelteImages, setPost} from '../../services/firebase'

function getPost(posts, paramsId) {
  return posts.find(post => post.id === parseInt(paramsId, 10))
}

function Post(props) {
  const [open, setOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  let params = useParams()
  let [searchParams, setSearchParams] = useSearchParams()
  let navigate = useNavigate()

  const {posts, filter} = props

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = () => {
    const postId = parseInt(params.postId, 10)
    const newPosts = props.posts.filter(post => {
      return post.id !== postId
    })

    setPost(newPosts).then(() => {
      props.deletePost(postId)
      delelteImages(postId).then(navigate('/'))
    })
  }

  useEffect(() => {
    setCurrentPost(getPost(posts, params.postId))
    props.fetchImages(parseInt(params.postId, 10))
  }, [])

  function onTagClick(e) {
    const tag = e.currentTarget.firstChild.textContent
    navigate(`/?tags=${tag}`)
  }

  function goBackHandler() {
    const f = filter ? `?tags=${filter.split(' ').join('+')}` : ''

    navigate(`/${f}`)
  }

  // function QueryNavLink({ to, ...props }) {
  //   setSearchParams({tags: filter})
  //   let location = useLocation();
  //   return <NavLink to={to + location.search} {...props} />;
  // }

  return (
    <>
      <Container maxWidth="lg" sx={{py: 3, mb: 4}}>
        <Stack direction="row" sx={{py: 1, px: 2}} style={{backgroundColor: '#efefef'}}>
          <Button size="large" onClick={goBackHandler} sx={{mr: 'auto'}}>
            <KeyboardBackspaceIcon />
            <Typography variant="h6" sx={{px: 2}}>
              к поиску
            </Typography>
          </Button>
          {props.user ? (
            <>
              <Button aria-label="Редактировать" onClick={() => navigate(`/edit/${params.postId}`)}>
                <EditIcon />
              </Button>
              <Button aria-label="Удалить" onClick={handleClickOpen}>
                <DeleteIcon />
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Вы уверены, что хотите удалить пост?</DialogTitle>
                <DialogActions style={{justifyContent: 'center'}}>
                  <Button onClick={handleDelete} style={{color: '#aaa'}}>
                    Да
                  </Button>
                  <Button onClick={handleClose}>Нет</Button>
                </DialogActions>
              </Dialog>
            </>
          ) : null}
        </Stack>
      </Container>

      <Container maxWidth="xl">
        {!props.currentImages ? (
          <Stack direction="row" justifyContent="center" sx={{p: 5}}>
            <CircularProgress />
          </Stack>
        ) : props.currentImages.length > 0 ? (
          <>
            <Swiper modules={[Navigation, Pagination]} navigation pagination={{clickable: true}}>
              {props.currentImages.map((image, idx) => {
                return (
                  <SwiperSlide
                    key={idx + 1}
                    style={{
                      height: 'auto',
                      maxHeight: '100vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingBottom: '50px',
                    }}
                  >
                    <img src={image} style={{maxWidth: '100%', maxHeight: '100%'}} />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </>
        ) : null}
      </Container>

      <Container maxWidth="md" style={{paddingTop: '30px', paddingBottom: '50px'}}>
        <Typography style={{fontWeight: 500}} variant="h5" sx={{mb: 4}}>
          {!!currentPost && currentPost.title}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{mb: 3}} style={{whiteSpace: 'pre-line'}}>
          {!!currentPost &&
            currentPost.text.split('*').map((t, idx) => {
              return <Fragment key={idx}>{idx % 2 !== 0 ? <b>{t}</b> : t}</Fragment>
            })}
        </Typography>
        <Box sx={{backgroundColor: '#efefef', p: '20px'}}>
          <Stack direction="row" flexWrap="wrap">
            {!!currentPost &&
              currentPost.tags.map((item, idx) => {
                return (
                  <Chip key={idx + 1} label={item} variant="outlined" sx={{mb: 1, mr: 1}} onClick={onTagClick}></Chip>
                )
              })}
          </Stack>
        </Box>
      </Container>
    </>
  )
}

// class Post extends Component {
//   componentDidMount() {
//     this.props.fetchImages(1)
//     this.props.fetchPost(1)
//   }

//   render() {
//     return (
//       <>
//         <Container maxWidth="lg">
//           {!this.props.currentImages ? (
//             <CircularProgress />
//           ) : (
//             <>
//               {this.props.currentImages.map((image, idx) => {
//                 return <img key={idx + 1} src={image} />
//               })}
//             </>
//           )}
//         </Container>

//         <Container maxWidth="md" style={{paddingTop: '30px'}}>
//           {!this.props.currentPost ? (
//             <CircularProgress />
//           ) : (
//             <>
//               <Typography style={{fontWeight: 500}} variant="h5" gutterBottom>
//                 {this.props.currentPost.title}
//               </Typography>
//               <Typography variant="body2" gutterBottom>
//                 {this.props.currentPost.text}
//               </Typography>
//               <Box sx={{backgroundColor: '#efefef', p: '20px'}}>
//                 <Stack direction="row" flexWrap="wrap">
//                   {this.props.currentPost.tags.map((item, idx) => {
//                     console.log(item)
//                     return (
//                       <Chip
//                         key={idx + 1}
//                         label={item}
//                         variant="outlined"
//                         sx={{mb: 1, mr: 1}}
//                         onClick={() => console.log('click')}
//                       ></Chip>
//                     )
//                   })}
//                 </Stack>
//               </Box>
//             </>
//           )}
//         </Container>
//       </>
//     )
//   }
// }

function mapStateToProps(state) {
  return {
    currentPost: state.post.currentPost,
    currentImages: state.post.currentImages,
    posts: state.post.posts,
    filter: state.post.filter,
    user: state.auth.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPost: value => dispatch(fetchPost(value)),
    fetchImages: value => dispatch(fetchImages(value)),
    deletePost: value => dispatch(deletePost(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)
