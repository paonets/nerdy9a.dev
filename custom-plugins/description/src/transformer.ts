import type { Root as HTMLRoot } from "hast";
import { toString } from "hast-util-to-string";
import type { QuartzTransformerPlugin } from "@quartz-community/types";
import { escapeHTML } from "@quartz-community/utils";
import type { VFile } from "vfile";
import clone from "rfdc";

const dbl = clone();

export interface DescriptionOptions {
  descriptionLength: number;
  maxDescriptionLength: number;
  replaceExternalLinks: boolean;
}

const defaultOptions: DescriptionOptions = {
  descriptionLength: 150,
  maxDescriptionLength: 300,
  replaceExternalLinks: true,
};

const urlRegex = new RegExp(
  /(https?:\/\/)?(?<domain>([\da-z.-]+)\.([a-z.]{2,6})(:\d+)?)(?<path>[/\w.-]*)(\?[/\w.=&;-]*)?/,
  "g",
);

export const Description: QuartzTransformerPlugin<Partial<DescriptionOptions>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };
  return {
    name: "Description",
    htmlPlugins() {
      return [
        () => {
          return async (tree: HTMLRoot, file: VFile) => {
            let frontMatterDescription = (
              file.data.frontmatter as Record<string, unknown> | undefined
            )?.description as string | undefined;

            // Mutate the original tree in place to add lazy loading and async decoding to all content images
            const traverseImages = (node: any) => {
              if (node.type === "element" && node.tagName === "img") {
                node.properties = node.properties || {};
                const classNames = node.properties.className;
                const isLogo = Array.isArray(classNames) && classNames.includes("homepage-logo");
                if (!isLogo) {
                  if (!node.properties.loading) {
                    node.properties.loading = "lazy";
                  }
                  if (!node.properties.decoding) {
                    node.properties.decoding = "async";
                  }
                }
              }
              if (node.children) {
                for (const child of node.children) {
                  traverseImages(child);
                }
              }
            };
            traverseImages(tree);

            // Clone the HTML AST to avoid mutating the original tree that gets rendered to the page.
            const cleanTree = dbl(tree);

            // Remove blockquotes/callouts from the text used to generate the description/preview.
            // This prevents banner notifications (like "Translated to English...") or other callouts
            // at the top of the page from leaking into search engine descriptions or social OG images.
            cleanTree.children = cleanTree.children.filter(
              (node) => !(node.type === "element" && node.tagName === "blockquote"),
            );

            let text = escapeHTML(toString(cleanTree));

            if (opts.replaceExternalLinks) {
              frontMatterDescription = frontMatterDescription?.replace(
                urlRegex,
                "$<domain>" + "$<path>",
              );
              text = text.replace(urlRegex, "$<domain>" + "$<path>");
            }

            if (frontMatterDescription) {
              file.data.description = frontMatterDescription;
              file.data.text = text;
              return;
            }

            const desc = text;
            const sentences = desc.replace(/\s+/g, " ").split(/\.\s/);
            let finalDesc = "";
            let sentenceIdx = 0;

            while (sentenceIdx < sentences.length) {
              const sentence = sentences[sentenceIdx];
              if (!sentence) break;

              const currentSentence = sentence.endsWith(".") ? sentence : sentence + ".";
              const nextLength = finalDesc.length + currentSentence.length + (finalDesc ? 1 : 0);

              if (nextLength <= opts.descriptionLength || sentenceIdx === 0) {
                finalDesc += (finalDesc ? " " : "") + currentSentence;
                sentenceIdx++;
              } else {
                break;
              }
            }

            file.data.description =
              finalDesc.length > opts.maxDescriptionLength
                ? finalDesc.slice(0, opts.maxDescriptionLength) + "..."
                : finalDesc;
            file.data.text = text;
          };
        },
      ];
    },
  };
};
