import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  author?: string
  description?: string
  image?: string
  excerpt?: string
  date: {
    time: number
    string: string
  }
}

declare const data: Post[]
export { data }

export default createContentLoader('posts/*.md', {
  excerpt: true,
  render: true,
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title as string,
        url,
        author: frontmatter.author as string | undefined,
        description: (frontmatter.description as string | undefined) || excerpt,
        image: frontmatter.image as string | undefined,
        excerpt,
        date: formatDate(frontmatter.date as string)
      }))
      .sort((a, b) => b.date.time - a.date.time)
  }
})

function formatDate(raw: string): Post['date'] {
  const date = new Date(raw)
  // Normalize to midday UTC so it avoids timezone drift
  date.setUTCHours(12, 0, 0, 0)
  return {
    time: +date,
    string: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
