"use client"

import * as React from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    }

    // eslint-disable-next-line deprecation/deprecation
    mql.addListener(onChange)
    // eslint-disable-next-line deprecation/deprecation
    return () => mql.removeListener(onChange)
  }, [query])

  return matches
}

