'use client'

// app/blog/BlogImage.tsx
// Wrapper de imagem com fallback automático caso o src quebre (ex: Sanity asset 404).

import Image from 'next/image'
import { useState } from 'react'

interface Props {
  src: string
  fallback?: string
  alt: string
  priority?: boolean
}

export default function BlogImage({ src, fallback, alt, priority }: Props) {
  const [imgSrc, setImgSrc] = useState(src)
  const [errored, setErrored] = useState(false)

  if (!imgSrc) return null

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      style={{ objectFit: 'cover' }}
      priority={priority}
      unoptimized
      onError={() => {
        if (!errored && fallback && fallback !== imgSrc) {
          setImgSrc(fallback)
          setErrored(true)
        } else {
          setImgSrc('')
        }
      }}
    />
  )
}
