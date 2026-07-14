import React from 'react'

const ReactQueryDevtools = React.lazy(() => {
    if (process.env.NODE_ENV === 'development') {
        return import('@tanstack/react-query-devtools').then((d) => ({
            default: d.ReactQueryDevtools,
        }))
    }
    return import('@tanstack/react-query-devtools/build/lib/index.prod.js').then(
        (d) => ({
            default: d.ReactQueryDevtools,
        })
    )
})

export default ReactQueryDevtools
