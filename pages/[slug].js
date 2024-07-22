import { clientConfig } from '@/lib/server/config'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { getAllPosts } from '@/lib/notion'
import { useLocale } from '@/lib/locale'
import { useConfig } from '@/lib/config'
import { createHash } from 'crypto'
import Container from '@/components/Container'
import Post from '@/components/Post'
import Comments from '@/components/Comments'
import { useEffect } from 'react'

let notion = null

export default function BlogPost ({ post, blockMap, emailHash }) {
  const router = useRouter()
  const BLOG = useConfig()
  const locale = useLocale()

  useEffect(() => {
    const { search } = router.query
    if (search) {
      const element = document.querySelector(`#${search}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' }) // 页面加载后滚动到具体位置
      }
    }
  }, [router.query])

  if (router.isFallback) return null

  const fullWidth = post.fullWidth ?? false

  return (
    <Container
      layout="blog"
      title={post.title}
      description={post.summary}
      slug={post.slug}
      type="article"
      fullWidth={fullWidth}
    >
      <Post
        post={post}
        blockMap={blockMap}
        emailHash={emailHash}
        fullWidth={fullWidth}
      />
      <div
        className={cn(
          'px-4 flex justify-between font-medium text-gray-500 dark:text-gray-400 my-5',
          fullWidth ? 'md:px-24' : 'mx-auto max-w-2xl'
        )}
      >
        <a>
          <button
            onClick={() => router.push(BLOG.path || '/')}
            className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
          >
            ← {locale.POST.BACK}
          </button>
        </a>
        <a>
          <button
            onClick={() => window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })}
            className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
          >
            ↑ {locale.POST.TOP}
          </button>
        </a>
      </div>
      <Comments frontMatter={post} />
    </Container>
  )
}

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: true })
  return {
    paths: posts.map(row => `${clientConfig.path}/${row.slug}`),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  const posts = await getAllPosts({ includePages: true })
  const post = posts.find(t => t.slug === slug)

  if (!post) return { notFound: true }

  if (!notion) {
    const { NotionAPI } = await import('notion-client')
    notion = new NotionAPI()
  }

  const blockMap = await notion.getPage(post.id)
  const emailHash = createHash('md5')
    .update(clientConfig.email)
    .digest('hex')
    .trim()
    .toLowerCase()

  return {
    props: { post, blockMap, emailHash },
    revalidate: 1
  }
}
