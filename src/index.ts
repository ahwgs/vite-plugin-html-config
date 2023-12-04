import type { Plugin, HtmlTagDescriptor } from "vite";
export interface IHTMLTag {
  [key: string]: string | boolean;
}

export type ScriptTag = Record<string, string | boolean> | string;
export interface Options {
  favicon?: string;
  title?: string;
  metas?: IHTMLTag[];
  links?: IHTMLTag[];
  style?: string;
  headScripts?: ScriptTag[];
  scripts?: ScriptTag[];
  preHeadScripts?: ScriptTag[];
}
export default function HtmlPlugin(rawOptions: Options): Plugin {
  const {
    favicon,
    title,
    headScripts = [],
    metas = [],
    links = [],
    style,
    scripts = [],
    preHeadScripts = [],
  } = rawOptions;

  const getScriptContent = (
    script: ScriptTag,
    injectTo: "head" | "body" | "head-prepend" | "body-prepend"
  ) => {
    let result = {} as HtmlTagDescriptor;
    if (typeof script === "object" && script.src) {
      result = {
        tag: "script",
        injectTo,
        attrs: { ...script },
      };
    } else if (typeof script === "object" && script.content) {
      const { content, ...attr } = script;
      result = {
        tag: "script",
        injectTo,
        attrs: { ...attr },
        children: `${content}`,
      };
    } else {
      result = {
        tag: "script",
        injectTo,
        children: `${script}`,
      };
    }
    return result;
  };

  return {
    name: "html-plugin",
    transformIndexHtml: {
      order: 'pre',
      handler: (html: string) => {
        let resultHtmlStr = html
        const htmlResult = [] as HtmlTagDescriptor[];
        if (favicon) {
          htmlResult.push({
            tag: "link",
            attrs: { rel: "shortcut icon", type: "image/x-icon", href: favicon },
            injectTo: "head",
          });
        }
        if (metas.length) {
          metas.forEach((meta) => {
            htmlResult.push({
              tag: "meta",
              injectTo: "head",
              attrs: { ...meta },
            });
          });
        }
        if (links.length) {
          links.forEach((meta) => {
            htmlResult.push({
              tag: "link",
              injectTo: "head",
              attrs: { ...meta },
            });
          });
        }
        if (style && style.length) {
          htmlResult.push({
            tag: "style",
            injectTo: "head",
            children: `${style}`
              .split("\n")
              .map((line) => `  ${line}`)
              .join("\n"),
          });
        }
        if (title && title.length) {
          // 如果 title 原本就存在
          resultHtmlStr = html.replace(
            /<title>(.*?)<\/title>/,
            `<title>${title}</title>`
          )
        }
        if (headScripts.length) {
          headScripts.forEach((script) => {
            htmlResult.push(getScriptContent(script, "head"));
          });
        }
        if (scripts.length) {
          scripts.forEach((script) => {
            htmlResult.push(getScriptContent(script, "body"));
          });
        }
        if (preHeadScripts.length) {
          preHeadScripts.forEach((script) => {
            htmlResult.push(getScriptContent(script, "head-prepend"));
          });
        }
        return {
          html: resultHtmlStr,
          tags: htmlResult
        }
      }
    }
  } as Plugin
}
