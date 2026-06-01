import { FullSlug, isFolderPath, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateAndAlphabetical(): SortFn {
  return (f1, f2) => {
    // Sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(f2)!.getTime() - getDate(f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byDateAndAlphabeticalFolderFirst(): SortFn {
  return (f1, f2) => {
    // Sort folders first
    const f1IsFolder = isFolderPath(f1.slug ?? "")
    const f2IsFolder = isFolderPath(f2.slug ?? "")
    if (f1IsFolder && !f2IsFolder) return -1
    if (!f1IsFolder && f2IsFolder) return 1

    // If both are folders or both are files, sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(f2)!.getTime() - getDate(f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

type Props = {
  limit?: number
  sort?: SortFn
} & QuartzComponentProps

export const PageList: QuartzComponent = ({ cfg, fileData, allFiles, limit, sort }: Props) => {
  const sorter = sort ?? byDateAndAlphabeticalFolderFirst()
  let list = allFiles.sort(sorter)
  if (limit) {
    list = list.slice(0, limit)
  }

  return (
    <ul class="section-ul">
      {list.map((page) => {
        const title = page.frontmatter?.title
        const tags = page.frontmatter?.tags ?? []
        const defaultDate = page.dates ? getDate(page) : undefined

        const createdDate = page.dates?.created
        const modifiedDate = page.dates?.modified

        const displayCreated = createdDate || defaultDate
        const createdStr = displayCreated
          ? displayCreated.toLocaleDateString(cfg.locale ?? "en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
          : ""
        const modifiedStr = modifiedDate
          ? modifiedDate.toLocaleDateString(cfg.locale ?? "en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
          : ""

        const showModified = modifiedStr && createdStr && modifiedStr !== createdStr

        return (
          <li class="section-li">
            <div class="section">
              <p class="meta created">
                {displayCreated && (
                  <time dateTime={displayCreated.toISOString()}>{createdStr}</time>
                )}
              </p>
              <div class="desc">
                <h3>
                  <a
                    href={resolveRelative(fileData.slug!, page.slug!)}
                    class="internal internal-link"
                  >
                    {title}
                  </a>
                </h3>
              </div>
              <p class="meta modified">
                {showModified && modifiedDate && (
                  <span>
                    Updated <time dateTime={modifiedDate.toISOString()}>{modifiedStr}</time>
                  </span>
                )}
              </p>
              <ul class="tags">
                {tags.map((tag) => (
                  <li>
                    <a
                      class="internal tag-link"
                      href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                    >
                      {tag}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

PageList.css = `
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`
