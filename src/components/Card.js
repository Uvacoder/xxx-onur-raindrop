import { Fragment } from 'react'
import NextLink from 'next/link'

import { cachedIsExternalLink } from '@/lib/utils'

const Wrapper = ({ url, isExternal, children, ...rest }) => {
  if (!url) return <div {...rest}>{children}</div>

  if (isExternal) {
    return (
      <a href={url} rel="noopener noreferrer" target="_blank" {...rest}>
        {children}
      </a>
    )
  }

  return (
    <Fragment>
      <NextLink href={url} {...rest}>
        {children}
      </NextLink>
    </Fragment>
  )
}

const Card = ({ title, subtitle, url, ...rest }) => {
  let isExternal = false
  if (url) isExternal = cachedIsExternalLink(url)

  return (
    <Wrapper
      url={url}
      isExternal={isExternal}
      className={`flex flex-col gap-y-1 rounded-lg p-2.5 -m-2.5 transition-colors duration-300 ${
        url ? 'hover:bg-gray-100 cursor-pointer' : ''
      }`}
      {...rest}
    >
      <p className="m-0 font-medium word-break">{title}</p>
      {subtitle && <p className="m-0 text-sm font-light text-gray-500 word-break">{subtitle}</p>}
    </Wrapper>
  )
}

export default Card
