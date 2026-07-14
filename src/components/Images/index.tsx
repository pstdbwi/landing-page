import React, { useState, useEffect, useMemo, memo } from 'react'
import clsx from 'clsx'
import NextImage from 'next/image.js'
import { ImageryProps } from '@/types/image'
import { blurDataURLDefault } from '@/components/Skeleton'
import { brokenImage, placeholderImage } from '@/constant/images'

const defaultBlurDataUrl = blurDataURLDefault()

const Imagery = (props: ImageryProps) => {
    const {
        width = 0,
        height = 0,
        src,
        className,
        blurDataURL,
        disableTransition,
        ...nextImageProps
    } = props
    const [isLoading, setLoading] = useState(true)
    const [imgSrc, setImgSrc] = useState(src)
    const classNames = useMemo(
        () =>
            clsx(
                className && className,
                !disableTransition && {
                    'duration-500': true,
                    'ease-in-out': true,
                    'blur-sm': isLoading,
                    'blur-0': !isLoading,
                }
            ),
        [disableTransition, isLoading]
    )

    useEffect(() => {
        setImgSrc(src || placeholderImage)
    }, [src])

    return (
        <NextImage
            src={imgSrc}
            width={width}
            height={height}
            className={classNames}
            blurDataURL={blurDataURL || defaultBlurDataUrl}
            onLoadingComplete={() => setLoading(false)}
            onError={() => {
                setImgSrc(brokenImage)
            }}
            {...nextImageProps}
        />
    )
}

export default memo(Imagery)
