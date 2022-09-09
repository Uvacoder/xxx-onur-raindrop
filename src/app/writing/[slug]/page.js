import { memo, Suspense } from 'react'

// --- Components
import WritingSeo from 'components/WritingSeo'
import RichText from 'components/contentful/RichText'

// --- Others
import { getPost, getAllPosts } from 'lib/contentful'
import { getDateTimeFormat } from 'utils/helpers'

const Post = memo(({ post }) => {
  const {
    title,
    description,
    date,
    slug,
    content,
    sys: { firstPublishedAt, publishedAt: updatedAt }
  } = post

  const postDate = date || firstPublishedAt
  const dateString = getDateTimeFormat(postDate)

  return (
    <>
      <WritingSeo
        title={title}
        description={description}
        publishedAt={postDate}
        updatedAt={updatedAt}
        url={`https://onur.dev/writing/${slug}`}
      />
      <article>
        <div className="flex flex-col gap-y-3 mb-6">
          <h1>{title}</h1>
          <time dateTime={postDate} className="block font-light text-gray-500">
            {dateString}
          </time>
        </div>
        <Suspense fallback={null}>
          <RichText content={content} />
        </Suspense>
      </article>
    </>
  )
})

export async function getStaticProps({ params, preview = false }) {
  const data = await getPost(params.slug, preview)

  return {
    props: {
      post: data?.post ?? null,
      headerTitle: data?.post?.title ?? ''
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
