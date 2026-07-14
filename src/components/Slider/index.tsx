"use client"
import React, { useRef, useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import '../../style/globals.css';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import { useGetBannerContent } from '@/services/content/hooks';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import Image from 'next/image';
import { Skeleton } from '../Skeleton';
import Link from 'next/link';

export default function TopBanner({corpId}: {corpId: string}) {
    const { data: banner, isLoading, isError } = useGetBannerContent({
			corpId: corpId
		})

    if (isLoading || isError) return <Skeleton className='w-full rounded-md h-[240px] mt-5' />

    const handleLink = (type: 'app' | 'external_web' | 'campaign', link: string, id?: string): string => {
        switch (type) {
            case 'app':
                return `https://${window.location.host}/accounts/press-release/${id}`
            case 'campaign':
                return `https://${window.location.host}/campaign/${id}`
            case 'external_web':
                return link
            default:
                return link
        }
    }

    return (
        <div className='mt-5'>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    bulletActiveClass: "swiper-pagination-active opacity-100 pr-[15px] text-white bg-primary-500"
                }}
                modules={[Autoplay, Pagination]}
                className="slider"
            >
                {banner?.map((banner: Record<string, any>, index: number) => {
                    return (
                        <SwiperSlide key={index}>
                            <AspectRatio ratio={16 / 9}>
                                <Link href={handleLink(banner?.type, banner?.permalink, banner?.content_id)}>
                                    <Image
                                        src={banner?.banner_url}
                                        fill
                                        sizes="(max-width: 480px) 100vw"
                                        alt="banner"
                                        className="object-cover cursor-pointer"
                                    />
                                </Link>
                            </AspectRatio>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    );
}
