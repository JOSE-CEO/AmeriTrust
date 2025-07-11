"use client"

import { useCurrentPath } from "@/hooks/use-pathname"

const pageInfo = {
  "/": { title: "Home", color: "bg-blue-600" },
  "/services": { title: "Services", color: "bg-green-600" },
  "/about": { title: "About Us", color: "bg-purple-600" },
  "/quote": { title: "Get Quote", color: "bg-orange-600" },
  "/testimonials": { title: "Testimonials", color: "bg-yellow-600" },
  "/contact": { title: "Contact", color: "bg-red-600" },
  "/admin": { title: "Admin", color: "bg-gray-600" },
}

export default function PageIndicator() {
  const currentPath = useCurrentPath()
  const currentPage = pageInfo[currentPath as keyof typeof pageInfo]

  if (!currentPage) return null

  return (
    <div className="fixed top-20 right-4 z-40 hidden lg:block">
      <div className="bg-white rounded-full shadow-lg p-2 border">
        <div className={`w-3 h-3 rounded-full ${currentPage.color} animate-pulse`} title={currentPage.title}></div>
      </div>
    </div>
  )
}
