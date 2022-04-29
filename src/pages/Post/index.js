import {Component, useEffect} from 'react'
import {Typography, Container, Chip, Stack, CircularProgress, Button} from '@mui/material'
import {Box} from '@mui/system'
import {connect, useDispatch} from 'react-redux'
import {fetchPost, fetchImages} from '../../redux/actions/post'
import post from '../../redux/reducers/post'
import {useParams, useNavigate, useSearchParams, useLocation, NavLink} from 'react-router-dom'
import {Navigation, Pagination} from 'swiper'
import {Swiper, SwiperSlide, SwiperPagination} from 'swiper/react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

function getPost(posts, paramsId) {
  return posts.find(post => post.id === parseInt(paramsId, 10))
}

function Post(props) {
  let params = useParams()
  let [searchParams, setSearchParams] = useSearchParams()
  let navigate = useNavigate()

  const {posts, filter} = props

  const currentPost = getPost(posts, params.postId)

  useEffect(() => {
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
          <Button size="large" onClick={goBackHandler}>
            <KeyboardBackspaceIcon />
            <Typography variant="h6" sx={{px: 2}}>
              Назад
            </Typography>
          </Button>
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingBottom: '50px',
                    }}
                  >
                    <img src={image} />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </>
        ) : null}
      </Container>

      <Container maxWidth="md" style={{paddingTop: '30px', paddingBottom: '50px'}}>
        <Typography style={{fontWeight: 500}} variant="h5" gutterBottom>
          {currentPost.title}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {currentPost.text}
        </Typography>
        <Box sx={{backgroundColor: '#efefef', p: '20px'}}>
          <Stack direction="row" flexWrap="wrap">
            {currentPost.tags.map((item, idx) => {
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
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPost: value => dispatch(fetchPost(value)),
    fetchImages: value => dispatch(fetchImages(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)
