"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useCurrentPath } from "@/hooks/use-pathname"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const currentPath = useCurrentPath()

  // Auto-generate breadcrumbs if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = currentPath.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }]

    let currentHref = ""
    pathSegments.forEach((segment) => {
      currentHref += `/${segment}`
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      breadcrumbs.push({ label, href: currentHref })
    })

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  // Don't show breadcrumbs on home page
  if (currentPath === "/") {
    return null
  }

  return (
    <nav className="bg-gray-50 py-3 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
              {index === 0 && <Home className="h-4 w-4 mr-1" />}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-green-600 font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-gray-600 hover:text-green-600 transition-colors duration-200">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
