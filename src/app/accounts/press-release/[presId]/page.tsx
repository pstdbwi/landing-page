"use client"

import { Header } from "@/components/Header"
import Lucide from "@/components/Icon/lucide"
import { usePressReleaseById } from "@/services/content/hooks"
import React from "react"
import moment from "moment"
export default function PressReleaseDetail({
    params,
}: {
    params: { presId: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const { data } = usePressReleaseById({ pressReleaseId: params.presId })
    let momentObj = moment.unix(data?.press_release?.created);
    let timeAgo = momentObj.fromNow();

    const Wrapper: React.FC<{
        children: React.ReactNode
    }> = (
        { children }
    ) => {
            return (
                <React.Fragment>
                    <Header title="Press release" className="left-0 top-0" />
                    <section className="mt-2 p-5">
                        {children}
                    </section>
                </React.Fragment>
            )
        }

    return (
        <Wrapper>
            <div className="inline-flex justify-between items-center mb-5">
                <span className="text-primary-500 font-bold">Berita Terkini</span>
            </div>
            <h1 className="text-base font-bold">{data?.press_release?.title}</h1>
            <div className="inline-flex items-center gap-2 py-3">
                <Lucide name='clock' size={10} />
                <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>
            <img src={data?.press_release?.thumbnail_url} alt="cover" className="w-full h-auto mb-4" />
            <div className="text-xs mb-5" dangerouslySetInnerHTML={{ __html: data?.press_release?.body }} />
            {/* <Separtor isAbsolute /> */}
        </Wrapper>
    )
}