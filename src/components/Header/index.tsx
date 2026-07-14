"use client"
import { useRouter, usePathname } from 'next/navigation'
import { HeaderConfig } from '@/constant/header-config'
import { IcShare } from "../Icon/svg"
import { cn } from '@/lib/utils'
import React from 'react'
import { ArrowLeftIcon, SearchIcon } from 'lucide-react'

interface Props {
    title?: string
    backTo?: string
    searchIcon?: boolean
    inverted?: boolean
    className?: string
}

const extractLastPathSegment = <T extends string>(url: T): string => {
    const parts = url.split('/');
    const lastPart = parts.pop();
    if (lastPart !== undefined) {
        return `/${lastPart}`;
    }
    return '';
}

const Header: React.FC<Props> = React.memo(
    ({
        title,
        backTo,
        searchIcon = false,
        inverted = false,
        className,
    }) => {
        const router = useRouter();
        const pathname = usePathname();
        const currentPathSegment = extractLastPathSegment(pathname);
        const currentHeaderTitle = React.useMemo(() => {
            const headerTitle = HeaderConfig.find(
                (item) => item.pathName === currentPathSegment
            );
            if (headerTitle) {
                return headerTitle.title;
            }
            return title;
        }, [currentPathSegment, title]);

        const handleBack = (): void => {
					if (backTo) {
              router.push(backTo);
            }else{
							if (typeof document !== 'undefined' && document.referrer && extractLastPathSegment(document?.referrer) !== '/accounts' && pathname == "/login") {
									router.push("/")
							}else{
								router.back();
							}
						}
        };

        return (
            <div className={cn('inline-flex justify-center items-center inset-x-0 fixed z-50', className)}>
                <div className={cn('p-5 inline-flex w-full items-center layout justify-between', inverted ? 'bg-white shadow-lg' : 'bg-primary-500')}>
                    <div className='inline-flex items-center space-x-2'>
                        <button onClick={handleBack}>
                            <ArrowLeftIcon size={20} color={cn(inverted ? 'black' : 'white')} />
                        </button>
                        <p className={cn('text-base font-bold line-clamp-1', !inverted ? 'text-white' : '')}>{currentHeaderTitle}</p>
                    </div>
                    {searchIcon && (
                        <button onClick={() => router.push('/search')}>
                            <SearchIcon size={20} color='white' />
                        </button>
                    )}
                </div>
            </div>
        );
    }
);

export { Header };