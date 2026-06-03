import type {
  FullSlug,
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPluginData,
  SortFn,
} from "@quartz-community/types";
import { PageList } from "./PageList";
import { htmlToJsx } from "@quartz-community/utils/jsx";
import type { ComponentChildren } from "preact";
import type { Root } from "hast";
import { i18n } from "../i18n";
import style from "./styles/listPage.scss";
import { getAllSegmentPrefixes } from "@quartz-community/utils/path";
import { resolveRelative } from "../util/path";

interface FolderContentOptions {
  showFolderCount: boolean;
  showSubfolders: boolean;
  sort?: SortFn;
}

const defaultOptions: FolderContentOptions = {
  showFolderCount: true,
  showSubfolders: true,
};

interface TrieNode {
  isFolder: boolean;
  children: TrieNode[];
  data: unknown;
  slug: string;
  displayName: string;
  findNode(path: string[]): TrieNode | undefined;
}

type PageEntry = QuartzPluginData & Record<string, unknown>;

function concatenateResources(
  ...resources: (string | string[] | undefined)[]
): string | string[] | undefined {
  const result = resources.filter((r): r is string | string[] => r !== undefined).flat();
  return result.length === 0 ? undefined : result;
}

function pagesFromTrie(folder: TrieNode, showSubfolders: boolean): PageEntry[] {
  return folder.children
    .map((node) => {
      const nodeData = node.data as PageEntry | null;
      if (nodeData) {
        if (nodeData.unlisted === true) return undefined;
        return nodeData;
      }

      if (node.isFolder && showSubfolders) {
        return {
          slug: node.slug as FullSlug,
          dates: mostRecentDatesFromChildren(node.children),
          frontmatter: { title: node.displayName, tags: [] },
        };
      }
      return undefined;
    })
    .filter((page): page is PageEntry => page !== undefined);
}

export function pagesFromAllFiles(
  allFiles: unknown[],
  folderSlug: string,
  showSubfolders: boolean,
): PageEntry[] {
  const folderPrefix = folderSlug.endsWith("/index")
    ? folderSlug.slice(0, -"index".length)
    : folderSlug.endsWith("/")
      ? folderSlug
      : folderSlug + "/";

  const directChildren: PageEntry[] = [];
  const subfolderFiles = new Map<string, PageEntry[]>();

  for (const file of allFiles as PageEntry[]) {
    if (file.unlisted === true) continue;
    const fileSlug = file.slug;
    if (!fileSlug || !fileSlug.startsWith(folderPrefix)) continue;

    const relativePath = fileSlug.slice(folderPrefix.length);
    if (!relativePath || relativePath === "index") continue;

    const segments = relativePath.split("/");

    if (segments.length === 1) {
      directChildren.push(file);
    } else if (showSubfolders) {
      const subfolderName = segments[0]!;
      if (!subfolderFiles.has(subfolderName)) {
        subfolderFiles.set(subfolderName, []);
      }
      subfolderFiles.get(subfolderName)!.push(file);
    }
  }

  for (const [subfolderName, files] of subfolderFiles) {
    const indexFile = files.find((f) => f.slug === `${folderPrefix}${subfolderName}/index`);
    if (indexFile) continue;

    directChildren.push({
      slug: `${folderPrefix}${subfolderName}/index` as FullSlug,
      dates: mostRecentDatesFromEntries(files),
      frontmatter: { title: subfolderName, tags: [] },
    });
  }

  return directChildren;
}

function mostRecentDatesFromChildren(children: TrieNode[]): PageEntry["dates"] {
  let maybeDates: PageEntry["dates"] | undefined;
  for (const child of children) {
    const childDates = (child.data as { dates?: PageEntry["dates"] } | null)?.dates;
    if (childDates) {
      if (!maybeDates) {
        maybeDates = { ...childDates };
      } else {
        if (childDates.created > maybeDates.created) maybeDates.created = childDates.created;
        if (childDates.modified > maybeDates.modified) maybeDates.modified = childDates.modified;
        if (childDates.published > maybeDates.published)
          maybeDates.published = childDates.published;
      }
    }
  }
  return maybeDates ?? { created: new Date(), modified: new Date(), published: new Date() };
}

function mostRecentDatesFromEntries(entries: PageEntry[]): PageEntry["dates"] {
  let maybeDates: PageEntry["dates"] | undefined;
  for (const entry of entries) {
    if (entry.dates) {
      if (!maybeDates) {
        maybeDates = { ...entry.dates };
      } else {
        if (entry.dates.created > maybeDates.created) maybeDates.created = entry.dates.created;
        if (entry.dates.modified > maybeDates.modified) maybeDates.modified = entry.dates.modified;
        if (entry.dates.published > maybeDates.published)
          maybeDates.published = entry.dates.published;
      }
    }
  }
  return maybeDates ?? { created: new Date(), modified: new Date(), published: new Date() };
}

export default ((opts?: Partial<FolderContentOptions>) => {
  const options: FolderContentOptions = { ...defaultOptions, ...opts };

  const FolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props;
    const ctx = props.ctx as { trie?: TrieNode } | undefined;
    const slug = (fileData as { slug?: string } | undefined)?.slug;

    if (!slug) return null;

    const trie = ctx?.trie;
    let allPagesInFolder: PageEntry[];

    const filterTags = (fileData?.frontmatter as any)?.filter_tags as string[] | undefined;
    const excludeTags =
      ((fileData?.frontmatter as any)?.exclude_tags as string[] | undefined) ?? [];

    if (filterTags && Array.isArray(filterTags) && filterTags.length > 0) {
      allPagesInFolder = ((allFiles as PageEntry[]) ?? []).filter((file) => {
        if (file.unlisted === true) return false;
        if (file.slug?.endsWith("/index") || file.slug === "index") return false;
        const fileTags = (file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes);
        if (excludeTags.some((t) => fileTags.includes(t))) return false;
        return filterTags.some((t) => fileTags.includes(t));
      });
    } else if (trie) {
      const folder = trie.findNode(slug.split("/"));
      if (!folder) return null;
      allPagesInFolder = pagesFromTrie(folder, options.showSubfolders);
    } else {
      allPagesInFolder = pagesFromAllFiles(allFiles ?? [], slug, options.showSubfolders);
    }

    const frontmatter = (fileData as { frontmatter?: Record<string, unknown> } | undefined)
      ?.frontmatter;
    const pageCover = frontmatter?.cover as string | undefined;
    const pageTitle = frontmatter?.title as string | undefined;

    const cssClasses = (frontmatter?.cssclasses as string[] | undefined) ?? [];
    const hasCover = !!pageCover;
    const classes = ["", ...cssClasses, ...(hasCover ? ["has-cover"] : [])].join(" ").trim();
    const listProps = {
      ...props,
      sort: options.sort,
      allFiles: allPagesInFolder,
    };

    const hastRoot = tree as Root;
    const content =
      hastRoot.children.length === 0
        ? (fileData as { description?: unknown } | undefined)?.description
        : htmlToJsx(hastRoot);

    const locale = (cfg as { locale?: string } | undefined)?.locale ?? "en-US";
    const fileSlug = (fileData as { slug?: string } | undefined)?.slug ?? "";

    const isTravelJournal = fileSlug.toLowerCase().startsWith("travel_journal");

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
        if (d1 && d2) return d2.getTime() - d1.getTime();
        if (d1 && !d2) return -1;
        if (!d1 && d2) return 1;
        const t1 = (f1.frontmatter?.title as string | undefined)?.toLowerCase() ?? "";
        const t2 = (f2.frontmatter?.title as string | undefined)?.toLowerCase() ?? "";
        return t1.localeCompare(t2);
      });
    };

    const hasAnyCover = allPagesInFolder.some((page) => page.frontmatter?.cover);

    const renderCardGrid = (pages: PageEntry[]) => {
      const sorted = sortPages(pages);
      return (
        <div class="card-grid">
          {sorted.map((page) => {
            const title = page.frontmatter?.title ?? page.slug;
            const pageTags = (page.frontmatter?.tags ?? []) as string[];
            const date = getPageDate(page);
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
                  href={resolveRelative(fileSlug as FullSlug, page.slug as FullSlug)}
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
    };

    const pageListContent = hasAnyCover
      ? (renderCardGrid(allPagesInFolder) as unknown as ComponentChildren)
      : (PageList(listProps) as unknown as ComponentChildren);

    return (
      <div class={`popover-hint${hasCover ? " has-cover" : ""}`}>
        {pageCover && (
          <div class="page-cover-banner">
            <img src={pageCover} alt={pageTitle ?? "Cover Image"} />
            <div class="page-cover-overlay">
              {pageTitle && <h1 class="page-cover-title">{pageTitle}</h1>}
            </div>
          </div>
        )}
        <article class={classes}>
          <div class="markdown-preview-view markdown-rendered">{content}</div>
        </article>
        <div class="page-listing">
          {isTravelJournal && allPagesInFolder.length > 0 && (
            <h2>Trip Logs</h2>
          )}
          {options.showFolderCount && !hasAnyCover && allPagesInFolder.length > 0 && (
            <p>
              {i18n(
                (cfg as { locale?: string } | undefined)?.locale ?? "en-US",
              ).pages.folderContent.itemsUnderFolder({
                count: allPagesInFolder.length,
              })}
            </p>
          )}
          <div>{pageListContent}</div>
        </div>
      </div>
    );
  };

  FolderContent.css = concatenateResources(style, PageList.css);
  return FolderContent;
}) satisfies QuartzComponentConstructor;
