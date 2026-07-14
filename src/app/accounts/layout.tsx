
import type { Metadata } from 'next'

import { siteConfig } from '@/constant/config'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
    title: {
        default: siteConfig.title,
        template: `%s | ${siteConfig.title}`,
    },
    description: siteConfig.description,
    robots: {
        index: true,
        follow: true
    },
    icons: {
        icon: '/favicon/favicon.ico',
        shortcut: '/favicon/favicon-16x16.png',
        apple: '/favicon/apple-touch-icon.png',
    },
}

export default function AccountsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className='relative pt-16 bg-white layout min-h-screen'>
            <Header className='absolute left-0 top-0' />
            {children}
        </main>
    )
}