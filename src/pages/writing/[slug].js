import { memo, useEffect } from 'react'
import tinytime from 'tinytime'

// --- Components
import BlogSeo from 'components/BlogSeo'
import RichText from 'components/RichText'

// --- Others
import { useHeaderTitleContext } from 'providers/HeaderTitleProvider'
import { getPost, getAllPosts } from 'lib/contentful'

const Post = memo(({ post }) => {
  const { setHeaderTitle } = useHeaderTitleContext()
  const {
    title,
    description,
    date,
    slug,
    content,
    sys: { firstPublishedAt, publishedAt: updatedAt }
  } = post

  useEffect(() => {
    setHeaderTitle(title)
  }, [setHeaderTitle])

  return (
    <>
      <BlogSeo
        title={title}
        description={description}
        publishedAt={date || firstPublishedAt}
        updatedAt={updatedAt}
        url={`https://onur.dev/writing/${slug}`}
      />
      <article>
        <div className="mb-6 space-y-2">
          <h1>{title}</h1>
          <time dateTime={date || firstPublishedAt} className="block font-light text-gray-500">
            {tinytime('{MMMM} {DD}, {YYYY}').render(new Date(date || firstPublishedAt))}
          </time>
        </div>
        <RichText content={content} />
      </article>
    </>
  )
})

export async function getStaticProps({ params, preview = false }) {
  const data = await getPost(params.slug, preview)

  return {
    props: {
      post: data?.post ?? null
    }
  }
}

export async function getStaticPaths({ preview = false }) {
  const allPosts = await getAllPosts(preview)

  return {
    paths: allPosts?.map(({ slug }) => `/writing/${slug}`) ?? [],
    fallback: false
  }
}

export default Post
