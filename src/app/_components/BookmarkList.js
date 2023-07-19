'use client'

import { useEffect, useState, useCallback } from 'react'
import { ArrowDownIcon } from 'lucide-react'

import { LoadingSpinner } from '@/app/_components/LoadingSpinner'
import { Button } from '@/app/_components/Button'
import { BookmarkCard } from '@/app/_components/BookmarkCard'
import { getCollection } from '@/lib/raindrop'
import cx from '@/lib/cx'

async function fetchDataByPageIndex(id, pageIndex) {
  const collection = await getCollection(id, pageIndex)
  return collection
}

export const BookmarkList = ({ initialData, id }) => {
  const [data, setData] = useState(initialData.items)
  const [pageIndex, setPageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMore = () => {
    if (!isReachingEnd || !isLoading) setPageIndex((prevPageIndex) => prevPageIndex + 1)
  }

  const fetchInfiniteData = useCallback(async () => {
    setIsLoading(true)
    const newData = await fetchDataByPageIndex(id, pageIndex)
    setData((prevData) => [...prevData, ...newData.items])
    setIsLoading(false)
  }, [id, pageIndex])

  useEffect(() => {
    if (pageIndex > 0) fetchInfiniteData()
  }, [pageIndex, fetchInfiniteData])

  const getChunks = useCallback(() => {
    const firstChunk = []
    const lastChunk = []
    data.forEach((element, index) => {
      if (index % 2 === 0) {
        firstChunk.push(element)
      } else {
        lastChunk.push(element)
      }
    })
    return [[...firstChunk], [...lastChunk]]
  }, [data])

  const chunks = getChunks(data)
  const isReachingEnd = data.length >= initialData.count
  const isTweetCollection = id === '15896982'

  return (
    <div>
      <div className={cx('grid gap-4 @lg:grid-cols-2', isTweetCollection && '-my-6')}>
        {chunks.map((chunk, chunkIndex) => {
          return (
            <div
              key={`chunk_${chunkIndex}`}
              className={cx('grid gap-4', isTweetCollection ? 'h-fit -space-y-12' : 'place-content-start')}
            >
              {chunk.map((bookmark) => {
                return <BookmarkCard key={bookmark._id} bookmark={bookmark} />
              })}
            </div>
          )
        })}
      </div>
      <div className="mt-8 flex min-h-[4rem] items-center justify-center text-sm lg:mt-12">
        {!isReachingEnd ? (
          <>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <Button as="button" onClick={handleLoadMore} disabled={isLoading} className="w-full justify-center">
                Load more
                <ArrowDownIcon size={16} />
              </Button>
            )}
          </>
        ) : (
          <p>{`That's all for now. Come back later for more.`}</p>
        )}
      </div>
    </div>
  )
}
