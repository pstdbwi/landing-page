"use client"
import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { AspectRatio } from "../AspecRatio"
import { useRouter } from "next/navigation"
import Lucide from "../Icon/lucide"
import moment from "moment"
import 'moment/locale/id';

const cardVariants = cva(
    "bg-white cursor-pointer flex-shrink-0 text-left",
    {
        variants: {
            variant: {
                default: "inline-flex flex-row-reverse items-center justify-between gap-2 border-b pb-2",
                vertical: "rounded-lg max-w-[250px] border-b border-x",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface CardProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cardVariants> {
    asChild?: boolean
    cover: string
    campaignType?: 'zakat' | 'sedekah' | 'wakaf'
    title?: string
    description?: string
    created?: number
    id: string
    variant: 'vertical' | 'default'
}

const PressReleaseCard = React.forwardRef<HTMLButtonElement, CardProps>((
    { className, title, id, description, created = 0, cover, campaignType = 'zakat', variant = 'default', asChild = false, ...props }, ref
) => {
    const router = useRouter()
    const Components = asChild ? Slot : "button"
    let momentObj = moment.unix(created);
    let timeAgo = momentObj.fromNow();
    return (
        <Components
            className={cn(cardVariants({ variant, className }))}
            ref={ref}
            onClick={() => router.push(`/accounts/press-release/${id}`)}
            {...props}
        >
            {
                variant === 'vertical' && (
                    <AspectRatio ratio={16 / 9}>
                        <Image src={cover} fill alt="banner" priority className={cn('object-cover', variant === 'vertical' && 'rounded-t-lg' || 'rounded-lg')} />
                    </AspectRatio>
                ) || (
                    <Image src={cover} width={100} height={100} alt="banner" priority className={cn('object-cover', variant === 'vertical' && 'rounded-t-lg' || 'rounded-lg')} />
                )
            }

            <div className={cn('space-y-1 p-1', variant === 'vertical' && 'p-2')}>
                <h1 className="text-sm font-bold line-clamp-1">{title}</h1>
                <p className="text-xs text-gray-500 line-clamp-1">{description}</p>
                <div className="inline-flex items-center gap-2 pt-3">
                    <Lucide name='clock' size={10} />
                    <span className="text-xs text-gray-500">{timeAgo}</span>
                </div>
            </div>
        </Components>
    )
})


export { PressReleaseCard, cardVariants }