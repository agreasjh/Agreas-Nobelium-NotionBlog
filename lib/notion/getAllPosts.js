import { config as BLOG } from '@/lib/server/config'
import { idToUuid } from 'notion-utils'
import dayjs from 'dayjs'
import api from '@/lib/server/notion-api'
import getAllPageIds from './getAllPageIds'
import getPageProperties from './getPageProperties'
import filterPublishedPosts from './filterPublishedPosts'

let notion = null

// notion-client v7 returns nested: block[id] = { value: { value: actualBlock, role } }
function getBlockValue (block, id) {
  const entry = block[id]?.value
  return entry?.value || entry
}

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */
export async function getAllPosts ({ includePages = false }) {
  if (!notion && typeof window === 'undefined') {
    const { NotionAPI } = await import('notion-client')
    notion = new NotionAPI({ authToken: process.env.NOTION_ACCESS_TOKEN })
  }

  const id = idToUuid(process.env.NOTION_PAGE_ID)
  const response = await api.getPage(id)
  const collectionEntry = Object.values(response.collection)[0]
  const collection = collectionEntry?.value?.value || collectionEntry?.value
  const collectionQuery = response.collection_query
  const block = response.block
  const schema = collection?.schema
  const rawMetadata = getBlockValue(block, id)

  // Check Type
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.log(`pageId "${id}" is not a database`)
    return null
  } else {
    // Construct Data
    const pageIds = getAllPageIds(collectionQuery)
    const data = []
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]
      const properties = (await getPageProperties(id, block, schema)) || null

      // Add fullwidth to properties
      properties.fullWidth = getBlockValue(block, id)?.format?.page_full_width ?? false
      // Convert date (with timezone) to unix milliseconds timestamp
      properties.date = (
        properties.date?.start_date
          ? dayjs.tz(properties.date?.start_date)
          : dayjs(getBlockValue(block, id)?.created_time)
      ).valueOf()

      if (notion) {
        // Get content of the page
        const pageContent = await notion.getPage(id)
        properties.content = JSON.stringify(pageContent)
      }

      data.push(properties)
    }

    // remove all the the items doesn't meet requirements
    const posts = filterPublishedPosts({ posts: data, includePages })

    // Sort by date
    if (BLOG.sortByDate) {
      posts.sort((a, b) => b.date - a.date)
    }
    return posts
  }
}
