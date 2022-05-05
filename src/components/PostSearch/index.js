import {Container, TextField, InputAdornment, Stack, Typography} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import {connect} from 'react-redux'
import {useState} from 'react'
import PostCard from '../PostCard/PostCard'
import {useSearchParams} from 'react-router-dom'
import {setFilter} from '../../redux/actions/post'

let resultTags

function getPostsByTags(searchValue, posts) {
  const newPosts = []

  const searchVal = searchValue ? searchValue : ''

  const tags = searchVal.split(' ')

  const filteredTags = tags.filter(tag => tag.length > 1)
  resultTags = filteredTags.slice()

  filteredTags.forEach(tag => {
    const filteredPosts = posts.filter(post => {
      return post.tags.filter(postTag => postTag.toLowerCase().includes(tag.toLowerCase())).length > 0
    })

    filteredPosts.forEach(post => {
      const idx = newPosts.findIndex(item => item.post.id === post.id)

      if (idx === -1) {
        const obj = {}
        obj.post = post
        obj.counter = 1

        newPosts.push(obj)
      } else {
        newPosts[idx].counter++
      }
    })
  })

  return newPosts.sort((item1, item2) => {
    return item2.counter - item1.counter
  })
}

function PostSerch(props) {
  let [searchParams, setSearchParams] = useSearchParams()

  function onInput(e) {
    let tags = e.target.value
    props.setFilter(tags)

    if (tags) {
      setSearchParams({tags})
    } else {
      setSearchParams({})
    }
  }

  return (
    <Container sx={{py: '30px'}}>
      <Typography variant="h3" sx={{textAlign: 'center', mb: 1}}>
        База знаний ТО
      </Typography>
      <Typography variant="h6" sx={{textAlign: 'center', mb: 3}}>
        Выполнена в виде постов, которые можно найти по ключевым словам (тегам)
      </Typography>
      <TextField
        fullWidth
        id="outlined-basic"
        label="Поиск поста по тегам"
        helperText="Введите ключевые слова через пробел"
        variant="outlined"
        type="search"
        value={searchParams.get('tags') || ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={onInput}
        sx={{mb: 2}}
      />

      <Stack spacing={2}>
        {getPostsByTags(searchParams.get('tags'), props.posts).map((post, id) => {
          const currentPost = post.post
          return <PostCard key={id} resultTags={resultTags} {...currentPost} />
        })}
      </Stack>
    </Container>
  )
}

function mapStateToProps(state) {
  return {
    posts: state.post.posts,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setFilter: value => dispatch(setFilter(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostSerch)
