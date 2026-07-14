"use client"

import { useGetFaqs } from "@/services/content/hooks"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/Accordion"
import React from "react"
import { Skeleton } from "@/components/Skeleton"

export default function Faq() {
    const { data, isLoading, isFetching, isError } = useGetFaqs({})

    const Wrapper: React.FC<{
        children: React.ReactNode
    }> = ({
        children
    }) => {
            return (
                <React.Fragment>
                    <section className="p-5">
                        {children}
                    </section>
                </React.Fragment>
            )
        }

    const RenderAccordion = () => {
        if (isLoading && isFetching || isError) {
            return (
                <div className="space-y-5">
                    <Skeleton className="w-full h-10 rounded-md" />
                    <Skeleton className="w-full h-10 rounded-md" />
                    <Skeleton className="w-full h-10 rounded-md" />
                </div>
            )
        }
        return (
            data?.map((item: Record<string, any>, index: number) => {
                return (
                    <AccordionItem value={item.id} key={index}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>
                            <div className="text-gray-500 text-sm" dangerouslySetInnerHTML={{ __html: item.answer }} />
                        </AccordionContent>
                    </AccordionItem>
                )
            })
        )
    }
    return (
        <Wrapper>
            <Accordion type="single" collapsible>
                <RenderAccordion />
            </Accordion>
        </Wrapper>
    )
}