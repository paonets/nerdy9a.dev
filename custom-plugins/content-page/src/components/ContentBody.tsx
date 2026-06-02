import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPluginData,
} from "@quartz-community/types";
import { htmlToJsx } from "@quartz-community/utils/jsx";
import type { Node } from "hast";
import { resolveRelative, getAllSegmentPrefixes } from "@quartz-community/utils/path";
import type { FullSlug } from "@quartz-community/utils/path";

export interface ContentBodyOptions {}

type Topic = {
  name: string;
  tags: string[];
};

type FrontmatterWithClasses = {
  cssclasses?: string[];
  filter_tags?: string[];
  topics?: Topic[];
  cover?: string;
  description?: string;
};

type PageEntry = QuartzPluginData & Record<string, unknown>;

export default (() => {
  const ContentBody: QuartzComponent = ({
    fileData,
    tree,
    allFiles,
    cfg,
  }: QuartzComponentProps) => {
    const content = htmlToJsx(tree as Node);

    const frontmatter = fileData?.frontmatter as FrontmatterWithClasses | undefined;
    const classes = frontmatter?.cssclasses ?? [];
    const classString = ["popover-hint", ...classes].join(" ");

    const filterTags = frontmatter?.filter_tags;
    const matchingPages =
      filterTags && Array.isArray(filterTags) && filterTags.length > 0
        ? ((allFiles as PageEntry[]) ?? []).filter((file) => {
            if (file.unlisted === true) return false;
            if (file.slug === "index") return false;
            if (
              file.slug?.endsWith("/index") &&
              !file.slug?.toLowerCase().startsWith("travel_journal/")
            )
              return false;
            const fileTags = (file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes);
            return filterTags.some((t) => fileTags.includes(t));
          })
        : [];

    const getPageDate = (page: PageEntry): Date | undefined => {
      const defaultDateType =
        (page.defaultDateType as "created" | "modified" | "published" | undefined) ?? "modified";
      return (page.dates?.[defaultDateType] ?? page.dates?.modified ?? page.dates?.created) as
        | Date
        | undefined;
    };

    const sortPages = (pages: PageEntry[]) => {
      return [...pages].sort((f1, f2) => {
        const d1 = getPageDate(f1);
        const d2 = getPageDate(f2);
        if (d1 && d2) {
          return d2.getTime() - d1.getTime();
        } else if (d1 && !d2) {
          return -1;
        } else if (!d1 && d2) {
          return 1;
        }
        const title1 = (f1.frontmatter?.title as string | undefined)?.toLowerCase() ?? "";
        const title2 = (f2.frontmatter?.title as string | undefined)?.toLowerCase() ?? "";
        return title1.localeCompare(title2);
      });
    };

    const sortedPages = sortPages(matchingPages);

    const topics = frontmatter?.topics;
    const hasTopics = topics && Array.isArray(topics) && topics.length > 0;

    const topicsWithPages = hasTopics
      ? topics.map((topic) => {
          const topicTags = topic.tags ?? [];
          const topicPages = matchingPages.filter((page) => {
            const fileTags = (page.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes);
            return topicTags.some((t) => fileTags.includes(t));
          });
          return {
            ...topic,
            pages: topicPages,
          };
        })
      : [];

    const categorizedPageSlugs = new Set<string>();
    if (hasTopics) {
      for (const topic of topicsWithPages) {
        for (const page of topic.pages) {
          if (page.slug) {
            categorizedPageSlugs.add(page.slug);
          }
        }
      }
    }

    const otherPages = hasTopics
      ? matchingPages.filter((page) => !page.slug || !categorizedPageSlugs.has(page.slug))
      : [];

    const renderPageList = (pages: PageEntry[]) => {
      const sorted = sortPages(pages);
      const hasAnyCover = sorted.some((page) => page.frontmatter?.cover);

      if (hasAnyCover) {
        return (
          <div class="card-grid">
            {sorted.map((page) => {
              const title = page.frontmatter?.title ?? page.slug;
              const pageTags = page.frontmatter?.tags ?? [];
              const date = getPageDate(page);
              const locale = (cfg as { locale?: string } | undefined)?.locale ?? "en-US";
              const cover = page.frontmatter?.cover as string | undefined;
              const description = page.frontmatter?.description as string | undefined;

              const createdDate = page.dates?.created;
              const modifiedDate = page.dates?.modified;

              const displayCreated = createdDate || date;
              const createdStr = displayCreated
                ? displayCreated.toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })
                : "";
              const modifiedStr = modifiedDate
                ? modifiedDate.toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })
                : "";

              const showModified = !!(modifiedStr && createdStr && modifiedStr !== createdStr);
              const displayDate = showModified && modifiedDate ? modifiedDate : displayCreated;
              const displayDateStr = showModified && modifiedStr ? modifiedStr : createdStr;

              return (
                <div class={`trip-card ${cover ? "has-cover" : "no-cover"}`}>
                  <a
                    href={resolveRelative(fileData.slug!, page.slug!)}
                    class="trip-card-link-wrapper"
                  >
                    {cover && (
                      <div class="trip-card-cover">
                        <img src={cover} alt={title} loading="lazy" />
                      </div>
                    )}
                    <div class="trip-card-content">
                      <p class="meta">
                        {displayDate && (
                          <time dateTime={displayDate.toISOString()}>{displayDateStr}</time>
                        )}
                      </p>
                      <h3>{title}</h3>
                      {description && <p class="desc">{description}</p>}
                      <ul class="tags">
                        {pageTags.slice(0, 3).map((tag) => (
                          <li>
                            <span class="tag-badge">#{tag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        );
      }

      return (
        <ul class="section-ul">
          {sorted.map((page) => {
            const title = page.frontmatter?.title ?? page.slug;
            const pageTags = page.frontmatter?.tags ?? [];
            const date = getPageDate(page);
            const locale = (cfg as { locale?: string } | undefined)?.locale ?? "en-US";

            const createdDate = page.dates?.created;
            const modifiedDate = page.dates?.modified;

            const displayCreated = createdDate || date;
            const createdStr = displayCreated
              ? displayCreated.toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              : "";
            const modifiedStr = modifiedDate
              ? modifiedDate.toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              : "";

            const showModified = !!(modifiedStr && createdStr && modifiedStr !== createdStr);
            const displayDate = showModified && modifiedDate ? modifiedDate : displayCreated;
            const displayDateStr = showModified && modifiedStr ? modifiedStr : createdStr;

            return (
              <li class="section-li">
                <div class="section">
                  <p class="meta">
                    {displayDate && (
                      <time dateTime={displayDate.toISOString()}>{displayDateStr}</time>
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
                  <ul class="tags">
                    {pageTags.map((tag) => (
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
            );
          })}
        </ul>
      );
    };

    return (
      <article class={classString}>
        {frontmatter?.cover && (
          <div class="page-cover-banner">
            <img src={frontmatter.cover} alt={fileData.frontmatter?.title ?? "Cover Image"} />
          </div>
        )}
        <div class="markdown-preview-view markdown-rendered">{content}</div>
        {hasTopics ? (
          <div class="page-listing topics-listing">
            {topicsWithPages.map((topic) => {
              if (topic.pages.length === 0) return null;
              return (
                <div class="topic-group" style={{ marginBottom: "2rem" }}>
                  <h2
                    class="topic-heading"
                    style={{
                      borderBottom: "1px solid var(--lightgray)",
                      paddingBottom: "0.5rem",
                      marginTop: "2rem",
                    }}
                  >
                    {topic.name}
                  </h2>
                  {renderPageList(topic.pages)}
                </div>
              );
            })}
            {otherPages.length > 0 && (
              <div class="topic-group" style={{ marginBottom: "2rem" }}>
                <h2
                  class="topic-heading"
                  style={{
                    borderBottom: "1px solid var(--lightgray)",
                    paddingBottom: "0.5rem",
                    marginTop: "2rem",
                  }}
                >
                  Other Notes
                </h2>
                {renderPageList(otherPages)}
              </div>
            )}
          </div>
        ) : (
          sortedPages.length > 0 && <div class="page-listing">{renderPageList(sortedPages)}</div>
        )}
      </article>
    );
  };

  return ContentBody;
}) satisfies QuartzComponentConstructor;
