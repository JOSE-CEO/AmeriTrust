"use client"

import { useCurrentPath } from "@/hooks/use-pathname"
import { useEffect, useState } from "react"

export default function NavProgress() {
  const currentPath = useCurrentPath()
  const [progress, setProgress] = useState(0)

  const pages = ["/", "/services", "/about", "/quote", "/testimonials", "/contact"]

  useEffect(() => {
    const currentIndex = pages.findIndex((page) => {
      if (page === "/") return currentPath === "/"
      return currentPath.startsWith(page)
    })

    if (currentIndex !== -1) {
      const progressPercentage = ((currentIndex + 1) / pages.length) * 100
      setProgress(progressPercentage)
    }
  }, [currentPath])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
