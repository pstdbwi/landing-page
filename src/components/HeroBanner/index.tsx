"use client"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../../style/globals.css';

// import required modules
import { useGetHeroBanner } from '@/services/content/hooks';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import Image from 'next/image';
import { Autoplay, Pagination } from 'swiper/modules';
import { Skeleton } from '../Skeleton';

export default function HeroBanner({corpId, corpProgramId}: {corpId: string, corpProgramId: string}) {
    const { data: banner, isLoading, isError } = useGetHeroBanner({
			corpId,
			corpProgramId
		})

    if (isLoading || isError) return <Skeleton className='w-full rounded-md h-[240px] mt-5' />

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
                                    <Image
                                        src={banner?.image_url}
                                        fill
                                        sizes="(max-width: 480px) 100vw"
                                        alt="banner"
                                        className="object-cover cursor-pointer"
                                    />
                            </AspectRatio>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    );
}
