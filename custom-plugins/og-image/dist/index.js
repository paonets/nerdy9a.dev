import { createRequire } from 'module';
import path from 'path';
import fs from 'fs/promises';
import { styleText } from 'util';
import satori from 'satori';
import sharp from 'sharp';

const require$1 = createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x2) => typeof require$1 !== "undefined" ? require$1 : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a2, b2) => (typeof require$1 !== "undefined" ? require$1 : a2)[b2]
}) : x2)(function(x2) {
  if (typeof require$1 !== "undefined") return require$1.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  __defProp(target, "default", { value: mod, enumerable: true }) ,
  mod
));

// node_modules/reading-time/lib/reading-time.js
var require_reading_time = __commonJS({
  "node_modules/reading-time/lib/reading-time.js"(exports, module) {
    function codeIsInRanges(number, arrayOfRanges) {
      return arrayOfRanges.some(
        ([lowerBound, upperBound]) => lowerBound <= number && number <= upperBound
      );
    }
    function isCJK(c2) {
      if ("string" !== typeof c2) {
        return false;
      }
      const charCode = c2.charCodeAt(0);
      return codeIsInRanges(
        charCode,
        [
          // Hiragana (Katakana not included on purpose,
          // context: https://github.com/ngryman/reading-time/pull/35#issuecomment-853364526)
          // If you think Katakana should be included and have solid reasons, improvement is welcomed
          [12352, 12447],
          // CJK Unified ideographs
          [19968, 40959],
          // Hangul
          [44032, 55203],
          // CJK extensions
          [131072, 191456]
        ]
      );
    }
    function isAnsiWordBound(c2) {
      return " \n\r	".includes(c2);
    }
    function isPunctuation(c2) {
      if ("string" !== typeof c2) {
        return false;
      }
      const charCode = c2.charCodeAt(0);
      return codeIsInRanges(
        charCode,
        [
          [33, 47],
          [58, 64],
          [91, 96],
          [123, 126],
          // CJK Symbols and Punctuation
          [12288, 12351],
          // Full-width ASCII punctuation variants
          [65280, 65519]
        ]
      );
    }
    function readingTime2(text, options = {}) {
      let words = 0, start = 0, end = text.length - 1;
      const wordsPerMinute = options.wordsPerMinute || 200;
      const isWordBound = options.wordBound || isAnsiWordBound;
      while (isWordBound(text[start])) start++;
      while (isWordBound(text[end])) end--;
      const normalizedText = `${text}
`;
      for (let i2 = start; i2 <= end; i2++) {
        if (isCJK(normalizedText[i2]) || !isWordBound(normalizedText[i2]) && (isWordBound(normalizedText[i2 + 1]) || isCJK(normalizedText[i2 + 1]))) {
          words++;
        }
        if (isCJK(normalizedText[i2])) {
          while (i2 <= end && (isPunctuation(normalizedText[i2 + 1]) || isWordBound(normalizedText[i2 + 1]))) {
            i2++;
          }
        }
      }
      const minutes = words / wordsPerMinute;
      const time = Math.round(minutes * 60 * 1e3);
      const displayed = Math.ceil(minutes.toFixed(2));
      return {
        text: displayed + " min read",
        minutes,
        time,
        words
      };
    }
    module.exports = readingTime2;
  }
});

// node_modules/reading-time/lib/stream.js
var require_stream = __commonJS({
  "node_modules/reading-time/lib/stream.js"(exports, module) {
    var readingTime2 = require_reading_time();
    var Transform = __require("stream").Transform;
    var util = __require("util");
    function ReadingTimeStream(options) {
      if (!(this instanceof ReadingTimeStream)) {
        return new ReadingTimeStream(options);
      }
      Transform.call(this, { objectMode: true });
      this.options = options || {};
      this.stats = {
        minutes: 0,
        time: 0,
        words: 0
      };
    }
    util.inherits(ReadingTimeStream, Transform);
    ReadingTimeStream.prototype._transform = function(chunk, encoding, callback) {
      const stats = readingTime2(chunk.toString(encoding), this.options);
      this.stats.minutes += stats.minutes;
      this.stats.time += stats.time;
      this.stats.words += stats.words;
      callback();
    };
    ReadingTimeStream.prototype._flush = function(callback) {
      this.stats.text = Math.ceil(this.stats.minutes.toFixed(2)) + " min read";
      this.push(this.stats);
      callback();
    };
    module.exports = ReadingTimeStream;
  }
});

// node_modules/reading-time/index.js
var require_reading_time2 = __commonJS({
  "node_modules/reading-time/index.js"(exports, module) {
    module.exports.default = module.exports = require_reading_time();
    module.exports.readingTimeStream = require_stream();
  }
});

// src/emitter.tsx
var import_reading_time = __toESM(require_reading_time2());

// node_modules/@quartz-community/types/dist/index.js
function joinSegments(...segments) {
  return segments.filter((segment) => segment.length > 0).join("/").replace(/\/+/g, "/");
}
var l;
function S(n2) {
  return n2.children;
}
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// node_modules/@quartz-community/utils/dist/index.js
function unescapeHTML(html) {
  return html.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&#039;", "'");
}

// node_modules/@quartz-community/utils/dist/sort.js
function getDate(data) {
  const defaultDateType = data.defaultDateType;
  if (!defaultDateType) {
    return void 0;
  }
  const dates = data.dates;
  return dates?.[defaultDateType];
}

// node_modules/@quartz-community/utils/dist/emoji.js
var U200D2 = String.fromCharCode(8205);
var UFE0Fg = /\uFE0F/g;
function getIconCode(char) {
  return toCodePoint(char.indexOf(U200D2) < 0 ? char.replace(UFE0Fg, "") : char);
}
function toCodePoint(unicodeSurrogates) {
  const r2 = [];
  let c2 = 0, p2 = 0, i2 = 0;
  while (i2 < unicodeSurrogates.length) {
    c2 = unicodeSurrogates.charCodeAt(i2++);
    if (p2) {
      r2.push((65536 + (p2 - 55296 << 10) + (c2 - 56320)).toString(16));
      p2 = 0;
    } else if (55296 <= c2 && c2 <= 56319) {
      p2 = c2;
    } else {
      r2.push(c2.toString(16));
    }
  }
  return r2.join("-");
}

// src/theme.ts
function getFontSpecificationName(spec) {
  if (typeof spec === "string") {
    return spec;
  }
  return spec.name;
}

// src/emoji.ts
var emojimap = void 0;
async function loadEmoji(code) {
  if (!emojimap) {
    const path2 = await import('path');
    const fs2 = await import('fs/promises');
    const mapPath = path2.join("quartz", "util", "emojimap.json");
    const data = JSON.parse(await fs2.readFile(mapPath, "utf-8"));
    emojimap = data;
  }
  const name = emojimap.codePointToName[`${code.toUpperCase()}`];
  if (!name) throw new Error(`codepoint ${code} not found in map`);
  const b64 = emojimap.nameToBase64[name];
  if (!b64) throw new Error(`name ${name} not found in map`);
  return b64;
}

// src/emitter.tsx
var QUARTZ = "quartz";
var defaultHeaderWeight = [700];
var defaultBodyWeight = [400];
var write = async (args) => {
  const pathToPage = joinSegments(args.ctx.argv.output, args.slug + args.ext);
  const dir = path.dirname(pathToPage);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(pathToPage, args.content);
  return pathToPage;
};
function getFileExtension(path2) {
  return path2.match(/\.([^./?#]+)(?:[?#]|$)/)?.[1];
}
function isAbsoluteURL(url) {
  return /^https?:\/\//.test(url);
}
function formatDate(d2, locale = "en-US") {
  return d2.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}
async function getSatoriFonts(headerFont, bodyFont) {
  const headerWeights = typeof headerFont === "string" ? defaultHeaderWeight : headerFont.weights ?? defaultHeaderWeight;
  const bodyWeights = typeof bodyFont === "string" ? defaultBodyWeight : bodyFont.weights ?? defaultBodyWeight;
  const headerFontName = typeof headerFont === "string" ? headerFont : headerFont.name;
  const bodyFontName = typeof bodyFont === "string" ? bodyFont : bodyFont.name;
  const headerFontPromises = headerWeights.map(async (weight) => {
    const data = await fetchTtf(headerFontName, weight);
    if (!data) return null;
    return {
      name: headerFontName,
      data,
      weight,
      style: "normal"
    };
  });
  const bodyFontPromises = bodyWeights.map(async (weight) => {
    const data = await fetchTtf(bodyFontName, weight);
    if (!data) return null;
    return {
      name: bodyFontName,
      data,
      weight,
      style: "normal"
    };
  });
  const [headerFonts, bodyFonts, thai400, thai700] = await Promise.all([
    Promise.all(headerFontPromises),
    Promise.all(bodyFontPromises),
    fetchTtf("Noto Sans Thai", 400),
    fetchTtf("Noto Sans Thai", 700)
  ]);
  const fonts = [
    ...headerFonts.filter((font) => font !== null),
    ...bodyFonts.filter((font) => font !== null)
  ];
  if (thai400) {
    fonts.push({
      name: "Noto Sans Thai",
      data: thai400,
      weight: 400,
      style: "normal"
    });
  }
  if (thai700) {
    fonts.push({
      name: "Noto Sans Thai",
      data: thai700,
      weight: 700,
      style: "normal"
    });
  }
  return fonts;
}
async function fetchTtf(rawFontName, weight) {
  const fontName = rawFontName.replaceAll(" ", "+");
  const cacheKey = `${fontName}-${weight}`;
  const cacheDir = path.join(QUARTZ, ".quartz-cache", "fonts");
  const cachePath = path.join(cacheDir, cacheKey);
  try {
    await fs.access(cachePath);
    return fs.readFile(cachePath);
  } catch {
  }
  const cssResponse = await fetch(
    `https://fonts.googleapis.com/css2?family=${fontName}:wght@${weight}`
  );
  const css = await cssResponse.text();
  const urlRegex = /url\((https:\/\/fonts.gstatic.com\/s\/.*?.ttf)\)/g;
  const match = urlRegex.exec(css);
  if (!match) {
    console.log(
      styleText(
        "yellow",
        `
Warning: Failed to fetch font ${rawFontName} with weight ${weight}, got ${cssResponse.statusText}`
      )
    );
    return;
  }
  const fontUrl = match[1];
  if (!fontUrl) {
    return;
  }
  const fontResponse = await fetch(fontUrl);
  const fontData = Buffer.from(await fontResponse.arrayBuffer());
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(cachePath, fontData);
  return fontData;
}
var defaultImage = ({
  cfg,
  userOpts,
  title,
  description,
  fileData,
  iconBase64
}) => {
  const { colorScheme } = userOpts;
  const theme = cfg.theme;
  const fontBreakPoint = 32;
  const useSmallerFont = title.length > fontBreakPoint;
  const rawDate = getDate(fileData);
  const date = rawDate ? formatDate(rawDate, cfg.locale) : null;
  const { minutes } = (0, import_reading_time.default)(fileData.text ?? "");
  const readingTimeText = (userOpts.readingTimeText ?? ((time) => `${time} min read`))(
    Math.ceil(minutes)
  );
  const tags = fileData.frontmatter?.tags ?? [];
  const bodyFont = `${getFontSpecificationName(theme.typography.body)}, "Noto Sans Thai", sans-serif`;
  const headerFont = `${getFontSpecificationName(theme.typography.header)}, "Noto Sans Thai", sans-serif`;
  return /* @__PURE__ */ u2(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        // satori 0.63+ lays out content-box like browsers; keep the padding inside the card
        boxSizing: "border-box",
        backgroundColor: theme.colors[colorScheme].light,
        padding: "2.5rem",
        fontFamily: bodyFont
      },
      children: [
        /* @__PURE__ */ u2(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.5rem"
            },
            children: [
              iconBase64 && /* @__PURE__ */ u2(
                "img",
                {
                  src: iconBase64,
                  alt: "",
                  width: 56,
                  height: 56,
                  style: {
                    borderRadius: "50%"
                  }
                }
              ),
              /* @__PURE__ */ u2(
                "div",
                {
                  style: {
                    display: "flex",
                    fontSize: 32,
                    color: theme.colors[colorScheme].gray,
                    fontFamily: bodyFont
                  },
                  children: cfg.baseUrl
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ u2(
          "div",
          {
            style: {
              display: "flex",
              marginTop: "1rem",
              marginBottom: "1.5rem"
            },
            children: /* @__PURE__ */ u2(
              "h1",
              {
                style: {
                  margin: 0,
                  fontSize: useSmallerFont ? 64 : 72,
                  fontFamily: headerFont,
                  fontWeight: 700,
                  color: theme.colors[colorScheme].dark,
                  lineHeight: 1.2,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                },
                children: title
              }
            )
          }
        ),
        /* @__PURE__ */ u2(
          "div",
          {
            style: {
              display: "flex",
              flex: 1,
              // let the description shrink so the footer stays on the card (satori 0.63+)
              minHeight: 0,
              overflow: "hidden",
              fontSize: 36,
              color: theme.colors[colorScheme].darkgray,
              lineHeight: 1.4
            },
            children: /* @__PURE__ */ u2(
              "p",
              {
                style: {
                  margin: 0,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 5,
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                },
                children: description
              }
            )
          }
        ),
        /* @__PURE__ */ u2(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "2rem",
              paddingTop: "2rem",
              borderTop: `1px solid ${theme.colors[colorScheme].lightgray}`
            },
            children: [
              /* @__PURE__ */ u2(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "2rem",
                    color: theme.colors[colorScheme].gray,
                    fontSize: 28
                  },
                  children: [
                    date && /* @__PURE__ */ u2("div", { style: { display: "flex", alignItems: "center" }, children: [
                      /* @__PURE__ */ u2(
                        "svg",
                        {
                          style: { marginRight: "0.5rem" },
                          width: "28",
                          height: "28",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          role: "img",
                          "aria-label": "Date",
                          children: [
                            /* @__PURE__ */ u2("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
                            /* @__PURE__ */ u2("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
                            /* @__PURE__ */ u2("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
                            /* @__PURE__ */ u2("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
                          ]
                        }
                      ),
                      date
                    ] }),
                    /* @__PURE__ */ u2("div", { style: { display: "flex", alignItems: "center" }, children: [
                      /* @__PURE__ */ u2(
                        "svg",
                        {
                          style: { marginRight: "0.5rem" },
                          width: "28",
                          height: "28",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          role: "img",
                          "aria-label": "Reading time",
                          children: [
                            /* @__PURE__ */ u2("circle", { cx: "12", cy: "12", r: "10" }),
                            /* @__PURE__ */ u2("polyline", { points: "12 6 12 12 16 14" })
                          ]
                        }
                      ),
                      readingTimeText
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ u2(
                "div",
                {
                  style: {
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                    maxWidth: "60%"
                  },
                  children: tags.slice(0, 3).map((tag) => /* @__PURE__ */ u2(
                    "div",
                    {
                      style: {
                        display: "flex",
                        padding: "0.5rem 1rem",
                        backgroundColor: theme.colors[colorScheme].highlight,
                        color: theme.colors[colorScheme].secondary,
                        borderRadius: "10px",
                        fontSize: 24
                      },
                      children: [
                        "#",
                        tag
                      ]
                    }
                  ))
                }
              )
            ]
          }
        )
      ]
    }
  );
};
var defaultOptions = {
  colorScheme: "lightMode",
  width: 1200,
  height: 630,
  imageStructure: defaultImage,
  excludeRoot: false,
  defaultTitle: "Untitled",
  defaultDescription: "No description provided",
  readingTimeText: (minutes) => `${minutes} min read`
};
async function generateSocialImage({ cfg, description, fonts, title, fileData }, userOpts) {
  const { width, height } = userOpts;
  const iconPath = joinSegments(QUARTZ, "static", "icon.png");
  let iconBase64 = void 0;
  try {
    const iconData = await fs.readFile(iconPath);
    const isPng = iconData[0] === 137 && iconData[1] === 80 && iconData[2] === 78 && iconData[3] === 71;
    const mimeType = isPng ? "image/png" : "image/jpeg";
    iconBase64 = `data:${mimeType};base64,${iconData.toString("base64")}`;
    console.log(
      `[OG-Image] Successfully loaded icon from ${iconPath}, detected MIME: ${mimeType}, base64 length: ${iconBase64.length}`
    );
  } catch (error) {
    console.warn(styleText("yellow", `Warning: Could not find icon at ${iconPath}: ${error}`));
  }
  const imageComponent = userOpts.imageStructure({
    cfg,
    userOpts,
    title,
    description,
    fonts,
    fileData,
    iconBase64
  });
  const svg = await satori(imageComponent, {
    width,
    height,
    fonts,
    loadAdditionalAsset: async (languageCode, segment) => {
      if (languageCode === "emoji") {
        return await loadEmoji(getIconCode(segment));
      }
      return languageCode;
    }
  });
  return sharp(Buffer.from(svg)).webp({ quality: 40 });
}
async function processOgImage(ctx, fileData, fonts, fullOptions) {
  const cfg = ctx.cfg.configuration;
  const slug2 = fileData.slug;
  const titleSuffix = cfg.pageTitleSuffix ?? "";
  const frontmatter = fileData.frontmatter;
  const title = (frontmatter?.title ?? fullOptions.defaultTitle ?? "") + titleSuffix;
  const description = frontmatter?.socialDescription ?? frontmatter?.description ?? unescapeHTML(fileData.description?.trim() ?? fullOptions.defaultDescription ?? "");
  const stream = await generateSocialImage(
    {
      title,
      description,
      fonts,
      cfg,
      fileData
    },
    fullOptions
  );
  return write({
    ctx,
    content: stream,
    slug: `${slug2}-og-image`,
    ext: ".webp"
  });
}
var CustomOgImagesEmitterName = "CustomOgImages";
var CustomOgImages = (userOpts) => {
  const fullOptions = { ...defaultOptions, ...userOpts };
  return {
    name: CustomOgImagesEmitterName,
    getQuartzComponents() {
      return [];
    },
    async *emit(ctx, content, _resources) {
      const cfg = ctx.cfg.configuration;
      const theme = cfg.theme;
      const headerFont = theme.typography.header;
      const bodyFont = theme.typography.body;
      const fonts = await getSatoriFonts(headerFont, bodyFont);
      for (const [_tree, vfile] of content) {
        const data = vfile.data;
        if (data.frontmatter?.socialImage !== void 0) continue;
        yield processOgImage(ctx, data, fonts, fullOptions);
      }
    },
    async *partialEmit(ctx, _content, _resources, changeEvents) {
      const cfg = ctx.cfg.configuration;
      const theme = cfg.theme;
      const headerFont = theme.typography.header;
      const bodyFont = theme.typography.body;
      const fonts = await getSatoriFonts(headerFont, bodyFont);
      for (const changeEvent of changeEvents) {
        if (!changeEvent.file) continue;
        const data = changeEvent.file.data;
        if (data.frontmatter?.socialImage !== void 0) continue;
        if (changeEvent.type === "add" || changeEvent.type === "change") {
          yield processOgImage(ctx, data, fonts, fullOptions);
        }
      }
    },
    externalResources: (ctx) => {
      if (!ctx.cfg.configuration.baseUrl) {
        return {};
      }
      const baseUrl = ctx.cfg.configuration.baseUrl;
      return {
        additionalHead: [
          (pageData) => {
            const isRealFile = pageData.filePath !== void 0;
            let userDefinedOgImagePath = pageData.frontmatter?.socialImage;
            if (userDefinedOgImagePath) {
              userDefinedOgImagePath = isAbsoluteURL(userDefinedOgImagePath) ? userDefinedOgImagePath : `https://${baseUrl}/static/${userDefinedOgImagePath}`;
            }
            const generatedOgImagePath = isRealFile ? `https://${baseUrl}/${pageData.slug}-og-image.webp` : void 0;
            const defaultOgImagePath = `https://${baseUrl}/static/og-image.png`;
            const ogImagePath = userDefinedOgImagePath ?? generatedOgImagePath ?? defaultOgImagePath;
            const ogImageMimeType = `image/${getFileExtension(ogImagePath) ?? "png"}`;
            return /* @__PURE__ */ u2(S, { children: [
              !userDefinedOgImagePath && /* @__PURE__ */ u2(S, { children: [
                /* @__PURE__ */ u2("meta", { property: "og:image:width", content: fullOptions.width.toString() }),
                /* @__PURE__ */ u2("meta", { property: "og:image:height", content: fullOptions.height.toString() })
              ] }),
              /* @__PURE__ */ u2("meta", { property: "og:image", content: ogImagePath }),
              /* @__PURE__ */ u2("meta", { property: "og:image:url", content: ogImagePath }),
              /* @__PURE__ */ u2("meta", { name: "twitter:image", content: ogImagePath }),
              /* @__PURE__ */ u2("meta", { property: "og:image:type", content: ogImageMimeType })
            ] });
          }
        ]
      };
    }
  };
};
/*! Bundled license information:

reading-time/lib/reading-time.js:
reading-time/lib/stream.js:
  (*!
   * reading-time
   * Copyright (c) Nicolas Gryman <ngryman@gmail.com>
   * MIT Licensed
   *)
*/

export { CustomOgImages, CustomOgImagesEmitterName };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map