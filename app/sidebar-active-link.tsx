'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

function normalizePath(path: string) {
    const pathWithoutHash = path.split('#', 1)[0]
    const pathWithoutQuery = pathWithoutHash.split('?', 1)[0]
    const pathWithoutTrailingSlash = pathWithoutQuery.replace(/\/$/, '') || '/'

    try {
        return decodeURI(pathWithoutTrailingSlash)
    } catch {
        return pathWithoutTrailingSlash
    }
}

export default function SidebarActiveLink() {
    const pathname = usePathname()

    useEffect(() => {
        const currentPath = normalizePath(pathname)

        const applyActiveLink = () => {
            const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>(
                '.nextra-sidebar a[href^="/"], .nextra-mobile-nav a[href^="/"]'
            )

            sidebarLinks.forEach((link) => {
                const item = link.closest<HTMLElement>('li')
                const isActive = normalizePath(link.getAttribute('href') ?? '') === currentPath

                if (item) {
                    item.dataset.routeActive = String(isActive)
                }
            })
        }

        applyActiveLink()
        const animationFrame = requestAnimationFrame(applyActiveLink)
        const observer = new MutationObserver(applyActiveLink)

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })

        return () => {
            cancelAnimationFrame(animationFrame)
            observer.disconnect()
            document.querySelectorAll<HTMLElement>(
                '.nextra-sidebar li[data-route-active], .nextra-mobile-nav li[data-route-active]'
            ).forEach((item) => {
                delete item.dataset.routeActive
            })
        }
    }, [pathname])

    return null
}
