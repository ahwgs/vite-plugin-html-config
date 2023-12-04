# vite-plugin-html-config [![npm](https://img.shields.io/npm/v/vite-plugin-html-config.svg)](https://npmjs.com/package/vite-plugin-html-config)

This plugin helps us configure additional html

The plugin is based on vite transformIndexHtml hooks.

If we want to distinguish the environment and introduce resources in index.html, we can use this plugin.
stand by, favicon url, metas config, link tag config, style tag config, headScripts config,body script config.

## Install

node version: >=12.0.0

vite version: >=5.0.0

```bash
yarn add vite-plugin-html-config -D
```

## Options

- title : set your html title
- favicon : html favicon url (href url)
- metas : html meta tag, such as key=xx,value=xxx
- links : html head link tag
- style : html style string
- headScripts : html head script
- preHeadScripts : html script with head prepend
- scripts : html script with body tag

## Usage

```javascript
// vite.config.js
import htmlPlugin from 'vite-plugin-html-config'

const htmlPluginOpt = {
  favicon: './logo.svg',
  headScripts: [
    `var msg = 'head script'
     console.log(msg);`,
    {
      async: true,
      src: 'https://abc.com/b.js',
      type: 'module',
    },
    { content: `console.log('hello')`, charset: 'utf-8' },
  ],
  preHeadScripts: [
    `var msg = 'pre head script'
    console.log(msg);`,
    {
      async: true,
      src: 'https://abc.com/b.js',
      type: 'module',
    },
    { content: `console.log('hello')`, charset: 'utf-8' },
  ],
  scripts: [
    `var msg = 'body script'
     console.log(msg);`,
    {
      async: true,
      src: 'https://abc.com/b.js',
      type: 'module',
    },
  ],
  metas: [
    {
      name: 'keywords',
      content: 'vite html meta keywords',
    },
    {
      name: 'description',
      content: 'vite html meta description',
    },
    {
      bar: 'custom meta',
    },
  ],
  links: [
    {
      rel: 'stylesheet',
      href: './style.css',
    },
    {
      rel: 'modulepreload',
      href: 'https://cn.vitejs.dev/assets/guide_api-plugin.md.6884005a.lean.js',
    },
  ],
  style: `body { color: red; };*{ margin: 0px }`,
}

module.exports = {
  plugins: [htmlPlugin(htmlPluginOpt)],
}
```

## Example

We can inject different scripts through different environments

such as:script in head,script in body and more.

in config file

```js
// vite.config.js

const headScripts = []

// from app env
const APP_ENV = 'pro'

const BAIDU_KEY = APP_ENV === 'pro' ? '123123' : 'xxxxxx'

if (APP_ENV === 'pro') {
  headScripts.push(
    {
      src: 'https://xxxxxxx/mito.js',
      apikey: '123123123123123',
      crossorigin: 'anonymous',
    },
    {
      src: 'https://bbbbb.js',
    }
  )
}

const htmlPluginOpt = {
  headScripts,
  metas: [
    {
      name: 'keywords',
      content: 'vite html meta keywords',
    },
    {
      name: 'description',
      content: 'vite html meta description',
    },
  ],
  links: [
    {
      rel: 'stylesheet',
      href: './style.css',
    },
    {
      rel: 'modulepreload',
      href: 'https://www.google.com/xxx.js',
    },
  ],
  scripts: [
    `var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?${BAIDU_KEY}";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();`,
  ],
  style: 'body { color: red; };*{ margin: 0px }',
}
module.exports = {
  plugins: [htmlPlugin(htmlPluginOpt)],
}
```

build index.html

```
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite React</title>
    <meta name="keywords" content="vite html meta keywords">
    <meta name="description" content="vite html meta description">
    <link rel="stylesheet" href="./style.css">
    <link rel="modulepreload" href="https://www.google.com/xxx.js">
    <style>  body { color: red; };*{ margin: 0px }</style>
    <script src="https://xxxxxxx/mito.js" apikey="123123123123123" crossorigin="anonymous" customTag=""></script>
    <script src="https://bbbbb.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script>var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?123123";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();</script>
  </body>
</html>
```

other example

[https://github.com/saschazar21/jpeg-butcher/blob/main/vite.config.ts#L30](https://github.com/saschazar21/jpeg-butcher/blob/main/vite.config.ts#L30)
