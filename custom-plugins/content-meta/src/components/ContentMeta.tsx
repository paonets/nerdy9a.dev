import type {
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPluginData,
  ValidDateType,
} from "@quartz-community/types";
import type { FilePath } from "@quartz-community/types";
import {
  simplifySlug as utilSimplifySlug,
  joinSegments,
  slugifyFilePath,
  splitAnchor,
} from "@quartz-community/utils";
import readingTime from "reading-time";
import { classNames } from "../util/lang";
import { i18n } from "../i18n";
import { DateComponent, getDate } from "../util/date";
import type { JSX } from "preact";
import style from "./styles/contentMeta.scss";

export interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean;
  showComma: boolean;
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
};

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts };

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text;

    if (text) {
      const segments: (string | JSX.Element)[] = [];

      if (fileData.dates) {
        const locale = cfg.locale || "en-US";
        const defaultDateType =
          (fileData.defaultDateType as ValidDateType | undefined) ??
          (cfg.defaultDateType as ValidDateType | undefined);
        if (defaultDateType) {
          const dataWithDefaultDateType: QuartzPluginData = {
            ...(fileData as QuartzPluginData),
            defaultDateType,
          };
          const date = getDate(dataWithDefaultDateType);
          if (date) {
            segments.push(<DateComponent date={date} locale={locale} />);
          }
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text as string);
        const locale = cfg.locale || "en-US";
        const i18nData = i18n(locale);
        const displayedTime = i18nData.components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        });
        segments.push(<span>{displayedTime}</span>);
      }

      // Display source property if available
      const source = fileData.frontmatter?.source;
      if (source) {
        const currentSlug = (fileData.slug as string) ?? "";

        const pathToRoot = (slug: string): string => {
          let rootPath = slug
            .split("/")
            .filter((x) => x !== "")
            .slice(0, -1)
            .map((_) => "..")
            .join("/");
          return rootPath.length === 0 ? "." : rootPath;
        };

        const resolveRelative = (current: string, target: string): string => {
          const simplified = utilSimplifySlug(target);
          const rootPath = pathToRoot(current);
          return joinSegments(rootPath, simplified);
        };

        const slugifyWikilinkTarget = (target: string): string => {
          const [rawPath, anchor] = splitAnchor(target);
          if (!rawPath) return anchor;
          const pathWithExt = rawPath.endsWith(".md") ? rawPath : `${rawPath}.md`;
          const slug = slugifyFilePath(pathWithExt as FilePath);
          return slug + anchor;
        };

        const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
        const MDLINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;
        const URL_RE = /https?:\/\/[^\s<>]+/g;

        const renderTextWithLinks = (textVal: string): (JSX.Element | string)[] | string => {
          const innerSegments: { start: number; end: number; node: JSX.Element }[] = [];

          for (const match of textVal.matchAll(WIKILINK_RE)) {
            const target = match[1]!;
            const display = match[2] ?? target;
            const href = resolveRelative(currentSlug, slugifyWikilinkTarget(target));
            innerSegments.push({
              start: match.index!,
              end: match.index! + match[0].length,
              node: (
                <a href={href} class="internal internal-link content-meta-link">
                  {display}
                </a>
              ),
            });
          }

          for (const match of textVal.matchAll(MDLINK_RE)) {
            const overlaps = innerSegments.some(
              (s) => match.index! < s.end && match.index! + match[0].length > s.start,
            );
            if (overlaps) continue;
            const display = match[1]!;
            const href = match[2]!;
            const isExternal = href.startsWith("http://") || href.startsWith("https://");
            const resolvedHref = isExternal ? href : resolveRelative(currentSlug, href);
            innerSegments.push({
              start: match.index!,
              end: match.index! + match[0].length,
              node: (
                <a
                  href={resolvedHref}
                  class={
                    isExternal
                      ? "external external-link content-meta-link"
                      : "internal internal-link content-meta-link"
                  }
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {display || href}
                </a>
              ),
            });
          }

          for (const match of textVal.matchAll(URL_RE)) {
            const overlaps = innerSegments.some(
              (s) => match.index! < s.end && match.index! + match[0].length > s.start,
            );
            if (overlaps) continue;

            innerSegments.push({
              start: match.index!,
              end: match.index! + match[0].length,
              node: (
                <a
                  href={match[0]}
                  class="external external-link content-meta-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {match[0]}
                </a>
              ),
            });
          }

          if (innerSegments.length === 0) return textVal;

          innerSegments.sort((a, b) => a.start - b.start);

          const result: (JSX.Element | string)[] = [];
          let cursor = 0;
          for (const seg of innerSegments) {
            if (seg.start > cursor) {
              result.push(textVal.slice(cursor, seg.start));
            }
            result.push(seg.node);
            cursor = seg.end;
          }
          if (cursor < textVal.length) {
            result.push(textVal.slice(cursor));
          }

          return result;
        };

        const renderSourceValue = (val: unknown) => {
          if (typeof val === "string") {
            return renderTextWithLinks(val);
          }
          return String(val);
        };

        let renderedSource: JSX.Element | (JSX.Element | string)[] | string;
        if (Array.isArray(source)) {
          renderedSource = source.map((item, idx) => (
            <>
              {idx > 0 && <span class="content-meta-separator">, </span>}
              {renderSourceValue(item)}
            </>
          ));
        } else {
          renderedSource = renderSourceValue(source);
        }

        segments.push(<span class="content-meta-source">Source: {renderedSource}</span>);
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      );
    } else {
      return null;
    }
  }

  ContentMetadata.css = style;

  return ContentMetadata;
}) satisfies QuartzComponentConstructor;
