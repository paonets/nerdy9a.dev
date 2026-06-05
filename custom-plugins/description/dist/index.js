var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
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

// ../../node_modules/rfdc/index.js
var require_rfdc = __commonJS({
  "../../node_modules/rfdc/index.js"(exports$1, module) {
    module.exports = rfdc;
    function copyBuffer(cur) {
      if (cur instanceof Buffer) {
        return Buffer.from(cur);
      }
      return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length);
    }
    function rfdc(opts) {
      opts = opts || {};
      if (opts.circles) return rfdcCircles(opts);
      const constructorHandlers = /* @__PURE__ */ new Map();
      constructorHandlers.set(Date, (o2) => new Date(o2));
      constructorHandlers.set(Map, (o2, fn) => new Map(cloneArray(Array.from(o2), fn)));
      constructorHandlers.set(Set, (o2, fn) => new Set(cloneArray(Array.from(o2), fn)));
      if (opts.constructorHandlers) {
        for (const handler2 of opts.constructorHandlers) {
          constructorHandlers.set(handler2[0], handler2[1]);
        }
      }
      let handler = null;
      return opts.proto ? cloneProto : clone2;
      function cloneArray(a2, fn) {
        const keys = Object.keys(a2);
        const a22 = new Array(keys.length);
        for (let i2 = 0; i2 < keys.length; i2++) {
          const k2 = keys[i2];
          const cur = a2[k2];
          if (typeof cur !== "object" || cur === null) {
            a22[k2] = cur;
          } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
            a22[k2] = handler(cur, fn);
          } else if (ArrayBuffer.isView(cur)) {
            a22[k2] = copyBuffer(cur);
          } else {
            a22[k2] = fn(cur);
          }
        }
        return a22;
      }
      function clone2(o2) {
        if (typeof o2 !== "object" || o2 === null) return o2;
        if (Array.isArray(o2)) return cloneArray(o2, clone2);
        if (o2.constructor !== Object && (handler = constructorHandlers.get(o2.constructor))) {
          return handler(o2, clone2);
        }
        const o22 = {};
        for (const k2 in o2) {
          if (Object.hasOwnProperty.call(o2, k2) === false) continue;
          const cur = o2[k2];
          if (typeof cur !== "object" || cur === null) {
            o22[k2] = cur;
          } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
            o22[k2] = handler(cur, clone2);
          } else if (ArrayBuffer.isView(cur)) {
            o22[k2] = copyBuffer(cur);
          } else {
            o22[k2] = clone2(cur);
          }
        }
        return o22;
      }
      function cloneProto(o2) {
        if (typeof o2 !== "object" || o2 === null) return o2;
        if (Array.isArray(o2)) return cloneArray(o2, cloneProto);
        if (o2.constructor !== Object && (handler = constructorHandlers.get(o2.constructor))) {
          return handler(o2, cloneProto);
        }
        const o22 = {};
        for (const k2 in o2) {
          const cur = o2[k2];
          if (typeof cur !== "object" || cur === null) {
            o22[k2] = cur;
          } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
            o22[k2] = handler(cur, cloneProto);
          } else if (ArrayBuffer.isView(cur)) {
            o22[k2] = copyBuffer(cur);
          } else {
            o22[k2] = cloneProto(cur);
          }
        }
        return o22;
      }
    }
    function rfdcCircles(opts) {
      const refs = [];
      const refsNew = [];
      const constructorHandlers = /* @__PURE__ */ new Map();
      constructorHandlers.set(Date, (o2) => new Date(o2));
      constructorHandlers.set(Map, (o2, fn) => new Map(cloneArray(Array.from(o2), fn)));
      constructorHandlers.set(Set, (o2, fn) => new Set(cloneArray(Array.from(o2), fn)));
      if (opts.constructorHandlers) {
        for (const handler2 of opts.constructorHandlers) {
          constructorHandlers.set(handler2[0], handler2[1]);
        }
      }
      let handler = null;
      return opts.proto ? cloneProto : clone2;
      function cloneArray(a2, fn) {
        const keys = Object.keys(a2);
        const a22 = new Array(keys.length);
        for (let i2 = 0; i2 < keys.length; i2++) {
          const k2 = keys[i2];
          const cur = a2[k2];
          if (typeof cur !== "object" || cur === null) {
            a22[k2] = cur;
          } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
            a22[k2] = handler(cur, fn);
          } else if (ArrayBuffer.isView(cur)) {
            a22[k2] = copyBuffer(cur);
          } else {
            const index = refs.indexOf(cur);
            if (index !== -1) {
              a22[k2] = refsNew[index];
            } else {
              a22[k2] = fn(cur);
            }
          }
        }
        return a22;
      }
      function clone2(o2) {
        if (typeof o2 !== "object" || o2 === null) return o2;
        if (Array.isArray(o2)) return cloneArray(o2, clone2);
        if (o2.constructor !== Object && (handler = constructorHandlers.get(o2.constructor))) {
          return handler(o2, clone2);
        }
        const o22 = {};
        refs.push(o2);
        refsNew.push(o22);
        for (const k2 in o2) {
          if (Object.hasOwnProperty.call(o2, k2) === false) continue;
          const cur = o2[k2];
          if (typeof cur !== "object" || cur === null) {
            o22[k2] = cur;
          } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
            o22[k2] = handler(cur, clone2);
          } else if (ArrayBuffer.isView(cur)) {
            o22[k2] = copyBuffer(cur);
          } else {
            const i2 = refs.indexOf(cur);
            if (i2 !== -1) {
              o22[k2] = refsNew[i2];
            } else {
              o22[k2] = clone2(cur);
            }
          }
        }
        refs.pop();
        refsNew.pop();
        return o22;
      }
      function cloneProto(o2) {
        if (typeof o2 !== "object" || o2 === null) return o2;
        if (Array.isArray(o2)) return cloneArray(o2, cloneProto);
        if (o2.constructor !== Object && (handler = constructorHandlers.get(o2.constructor))) {
          return handler(o2, cloneProto);
        }
        const o22 = {};
        refs.push(o2);
        refsNew.push(o22);
        for (const k2 in o2) {
          const cur = o2[k2];
          if (typeof cur !== "object" || cur === null) {
            o22[k2] = cur;
          } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
            o22[k2] = handler(cur, cloneProto);
          } else if (ArrayBuffer.isView(cur)) {
            o22[k2] = copyBuffer(cur);
          } else {
            const i2 = refs.indexOf(cur);
            if (i2 !== -1) {
              o22[k2] = refsNew[i2];
            } else {
              o22[k2] = cloneProto(cur);
            }
          }
        }
        refs.pop();
        refsNew.pop();
        return o22;
      }
    }
  }
});

// node_modules/hast-util-to-string/lib/index.js
function toString(node) {
  if ("children" in node) {
    return all(node);
  }
  return "value" in node ? node.value : "";
}
function one(node) {
  if (node.type === "text") {
    return node.value;
  }
  return "children" in node ? all(node) : "";
}
function all(node) {
  let index = -1;
  const result = [];
  while (++index < node.children.length) {
    result[index] = one(node.children[index]);
  }
  return result.join("");
}
"function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/@quartz-community/utils/dist/index.js
function escapeHTML(unsafe) {
  return unsafe.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

// src/transformer.ts
var import_rfdc = __toESM(require_rfdc());
var dbl = (0, import_rfdc.default)();
var defaultOptions = {
  descriptionLength: 150,
  maxDescriptionLength: 300,
  replaceExternalLinks: true
};
var urlRegex = new RegExp(
  /(https?:\/\/)?(?<domain>([\da-z.-]+)\.([a-z.]{2,6})(:\d+)?)(?<path>[/\w.-]*)(\?[/\w.=&;-]*)?/,
  "g"
);
var Description = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };
  return {
    name: "Description",
    htmlPlugins() {
      return [
        () => {
          return async (tree, file) => {
            let frontMatterDescription = file.data.frontmatter?.description;
            const traverseImages = (node) => {
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
            const cleanTree = dbl(tree);
            cleanTree.children = cleanTree.children.filter(
              (node) => !(node.type === "element" && node.tagName === "blockquote")
            );
            let text = escapeHTML(toString(cleanTree));
            if (opts.replaceExternalLinks) {
              frontMatterDescription = frontMatterDescription?.replace(
                urlRegex,
                "$<domain>$<path>"
              );
              text = text.replace(urlRegex, "$<domain>$<path>");
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
            file.data.description = finalDesc.length > opts.maxDescriptionLength ? finalDesc.slice(0, opts.maxDescriptionLength) + "..." : finalDesc;
            file.data.text = text;
          };
        }
      ];
    }
  };
};

export { Description };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map