declare class BookmarkItem {
  constructor()

  title: string
  type: string
  path: string
  added: number
  lastModified: number
  url: string
  icon: string
  children: Array<BookmarkItem>
}

declare class ParseBookmarksOptions {
  constructor()

  DOMParser: object
  flatten: boolean
}

export function parseBookmarks(
  html: string,
  options: ParseBookmarksOptions
): Array<BookmarkItem>
