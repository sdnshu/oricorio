import React from 'react'

import { Sidebar } from '@/app/(root)/_components/sidebar'
import { Header } from '@/app/(root)/_components/header'

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

const Layout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <Sidebar variant="inset" />
            <SidebarInset>
                <Header />
                <section className='p-4'>{children}</section>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout