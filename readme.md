# DATUAN Sitemap Warmer

A CLI script built to help you warm up the website cache by scanning through the `sitemap.xml`. This utility help to warm up website in major encoding
 like `brotli`, `gzip`, warm up images by various encoding like AVIF, WebP.

![Plugin screenshot](https://datuan.dev/wp-content/uploads/2020/12/datuan-sitemap-warmer.png)

-----------------------------------------
Tài liệu Tiếng Việt tại đây - Vietnamese documentation here: https://datuan.dev/backlog/datuan-sitemap-warmer/

-----------------------------------------
![master](https://github.com/tdtgit/TDT-sitemap-warmer/workflows/Node.js%20CI/badge.svg) [![npm version](https://badge.fury.io/js/datuan-sitemap-warmer.svg)](https://www.npmjs.com/package/datuan-sitemap-warmer) [![Known Vulnerabilities](https://snyk.io/test/github/tdtgit/sitemap-warmer/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tdtgit/sitemap-warmer?targetFile=package.json)

By default, this utility will warm up any URLs that changed in last 5 minutes (300s) by checking the value of `<lastmod>` tag in sitemap.xml files and
 any images inside URLs through `<image:image>` tag. If you want to test this plugin, try to update some posts or pages or using parameter `--range` with a higher value. See [Options](#options) section for more details.
 
## Requirements
* NodeJS 10/12/14
* Ubuntu/CentOS/*nix or Windows/MacOS
* A website has a sitemap.xml endpoint. Example: https://datuan.dev/sitemap.xml. Tested and worked well with plugins [RankMath SEO](https://rankmath.com/kb/configure-sitemaps/) and [Yoast SEO](https://yoast.com/help/xml-sitemaps-in-the-wordpress-seo-plugin/).
 
## How to use
Install NodeJS and install the utility by command below:

```
npm install -g datuan-sitemap-warmer
```

Then you can try to scan and warm up some sites using a simple command. Replace `datuan.dev` to your site's domain. 

```
warmup https://datuan.dev
```

You can (should) setup a cronjob to run your command automatically. The recommendation interval is every minute.

```
* * * * * warmup https://datuan.dev
```

For best practice, add another cronjob to warm up all URLs in sitemap in case any URL not warmed up yet. See more at [Options](#options) section.

```
0 */12 * * * warmup https://datuan.dev -a
* * * * * warmup https://datuan.dev
```

You can also warm up multiple domains of course.

```
* * * * * warmup https://domain1.com
*/2 * * * * warmup https://domain2.net
*/5 * * * * warmup https://domain3.xyz
```

## Options

Usage:

```
warmup https://datuan.dev <parameter>
```

| Parameter        	| Description                                                                                                         	| Default         	|
|------------------	|---------------------------------------------------------------------------------------------------------------------	|-----------------	|
| `-a`, `--all`    	| Warm up all URLs in sitemap                                                                                         	| False           	|
| `-r`, `--range`  	| Only warm up URLs with `lastMod` newer than X seconds.<br> This parameters is ignored if `-a` (`--all`) is provided 	| 300 (5 minutes) 	|
| `-d`, `--delay`  	| Delay (in miliseconds) between each warm up call.<br> If you using the low-end hosting, keep this value higher      	| 500             	|
| `-i`, `--images` 	| Enable images warm up                                                                                               	| True            	|
| `-q`, `--quite`  	| Suppress the debug log                                                                                              	| False           	|
