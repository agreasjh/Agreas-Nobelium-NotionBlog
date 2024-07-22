import { useState } from 'react'
import BlogPost from '@/components/BlogPost'
import Container from '@/components/Container'
import Tags from '@/components/Tags'
import PropTypes from 'prop-types'
import Link from 'next/link'

const SearchLayout = ({ tags, posts, currentTag }) => {
  const [searchValue, setSearchValue] = useState('')
  let filteredBlogPosts = []

  const getSnippet = (content, searchValue) => {
    const index = content.toLowerCase().indexOf(searchValue.toLowerCase()) // 获取搜索关键词的位置
    const snippetLength = 30
    if (index === -1) return content.slice(0, snippetLength) + '...' // 如果找不到关键词，则返回内容开头的片段
    const start = Math.max(0, index - snippetLength)
    const end = Math.min(content.length, index + snippetLength)
    return '...' + content.slice(start, end) + '...' // 返回包含关键词的上下文片段
  }

  if (posts) {
    filteredBlogPosts = posts.filter(post => {
      const tagContent = post.tags ? post.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent + post.content // 添加文章内容字段
      return searchContent.toLowerCase().includes(searchValue.toLowerCase())
    }).map(post => ({
      ...post,
      snippet: getSnippet(post.content, searchValue) // 添加上下文片段
    }))
  }

  return (
    <Container>
      <div className="relative">
        <input
          type="text"
          placeholder={
            currentTag ? `Search in #${currentTag}` : 'Search Articles'
          }
          className="block w-full border px-4 py-2 border-black bg-white text-black dark:bg-night dark:border-white dark:text-white"
          onChange={e => setSearchValue(e.target.value)}
        />
        <svg
          className="absolute right-3 top-3 h-5 w-5 text-black dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <Tags tags={tags} currentTag={currentTag} />
      <div className="article-container my-8">
        {!filteredBlogPosts.length && (
          <p className="text-gray-500 dark:text-gray-300">No posts found.</p>
        )}
        {filteredBlogPosts.slice(0, 20).map(post => (
          <div key={post.id} className="mb-4">
            <Link href={`/${post.slug}#${searchValue}`}>
              <a className="block">
                <h2>{post.title}</h2>
                <p className="text-gray-500 dark:text-gray-300">{post.snippet}</p> {/* 显示上下文片段 */}
              </a>
            </Link>
          </div>
        ))}
      </div>
    </Container>
  )
}

SearchLayout.propTypes = {
  posts: PropTypes.array.isRequired,
  tags: PropTypes.object.isRequired,
  currentTag: PropTypes.string
}
export default SearchLayout
