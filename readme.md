# DATUAN Sitemap Warmer

A CLI script built to help you warm up the website cache by scanning through the `sitemap.xml`. This utility help to
warm up website in major encoding like `brotli`, `gzip`, warm up images by various encoding like AVIF, WebP.

![Plugin screenshot](https://datuan.dev/wp-content/uploads/2020/12/datuan-sitemap-warmer.png)

-----------------------------------------
Tài liệu Tiếng Việt tại đây - Vietnamese documentation here: https://datuan.dev/backlog/datuan-sitemap-warmer/

-----------------------------------------
![master](https://github.com/tdtgit/TDT-sitemap-warmer/workflows/Node.js%20CI/badge.svg) [![npm version](https://badge.fury.io/js/datuan-sitemap-warmer.svg)](https://www.npmjs.com/package/datuan-sitemap-warmer) [![Known Vulnerabilities](https://snyk.io/test/github/tdtgit/sitemap-warmer/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tdtgit/sitemap-warmer?targetFile=package.json)

By default, this utility will warm up any URLs that changed in last 5 minutes (300s) by checking the value
of `<lastmod>` tag in sitemap.xml files and any images inside URLs through `<image:image>` tag. If you want to test this
plugin, try to update some posts or pages or using parameter `--range`
with a higher value. See [Options](#options) section for more details.

## Quick start with Docker

```
docker run tdtgit/sitemap-warmer yourdomain.com
```

For more options and parameters, please refer to [Options](#options) section.

## Requirements
(In case you don't have Docker installation)
* NodeJS 10/12/14
* Ubuntu/CentOS/*nix or Windows/MacOS
* A website has a sitemap.xml endpoint. Example: https://datuan.dev/sitemap.xml. Tested and worked well with
  plugins [RankMath SEO](https://rankmath.com/kb/configure-sitemaps/), [Yoast SEO](https://yoast.com/help/xml-sitemaps-in-the-wordpress-seo-plugin/), [Jetpack](https://jetpack.com/).

## How to use

Install NodeJS and install the utility by command below:

```
npm install -g datuan-sitemap-warmer
```

Then you can try to scan and warm up some sites using a simple command. Replace `datuan.dev` to your site's domain.
Protocol (`https://`) is a default option and only specific if your site are still running `http://`

```
warmup datuan.dev
# OR
warmup http://nonhttps.com
```

You can (should) setup a cronjob to run your command automatically. The recommendation interval is every minute.

```
* * * * * warmup datuan.dev
```

For best practice, add another cronjob to warm up all URLs in sitemap in case any URL not warmed up yet. See more
at [Options](#options) section.

```
0 */12 * * * warmup datuan.dev -a
* * * * * warmup datuan.dev
```

You can also warm up multiple domains of course.

```
* * * * * warmup http://domain1.com
*/2 * * * * warmup domain2.net
*/5 * * * * warmup domain3.xyz
```

## Options

Usage:

```
warmup datuan.dev <URL> <parameter>
```

| Parameter            | Description                                                                                                            | Default            |
|------------------	|---------------------------------------------------------------------------------------------------------------------	|-----------------	|
| `-a`, `--all`        | Warm up all URLs in sitemap                                                                                            | False            |
| `-r`, `--range`    | Only warm up URLs with `lastMod` newer than X seconds.<br> This parameters is ignored if `-a` (`--all`) is provided    | 300s (5 minutes)    |
| `-d`, `--delay`    | Delay (in miliseconds) between each warm up call.<br> If you using the low-end hosting, keep this value higher        | 500                |
| `--no-images`    | Disable images warm up                                                                                               | False                |
| `--no-css`    | Disable CSS warm up                                                                                               | False                |
| `--no-js`    | Disable Javascript warm up                                                                                               | False                |
| `--no-brotli`    | Disable Brotli compression warm up                                                                                               | False                |
| `-q`, `--quite`    | Suppress the debug log                                                                                                | False            |
