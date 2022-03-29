# DATUAN Sitemap Warmer
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

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

```shell
docker run tdtgit/sitemap-warmer yourdomain.com
```

For more options and parameters, please refer to [Options](#options) section.

## Requirements
(In case you don't have Docker installation)
* NodeJS 12/14/16+
* Ubuntu/CentOS/*nix or Windows/MacOS
* A website has a sitemap.xml endpoint. Example: https://datuan.dev/sitemap.xml. Tested and worked well with
  plugins [RankMath SEO](https://rankmath.com/kb/configure-sitemaps/), [Yoast SEO](https://yoast.com/help/xml-sitemaps-in-the-wordpress-seo-plugin/), [Jetpack](https://jetpack.com/).

## How to use

Install NodeJS and install the utility by command below:

```shell
npm install -g datuan-sitemap-warmer
```

Then you can try to scan and warm up some sites using a simple command. Replace `datuan.dev` to your site's domain.
Protocol (`https://`) is a default option and only specific if your site are still running `http://`

```shell
warmup datuan.dev
# OR
warmup http://nonhttps.com
```

You can (should) setup a cronjob to run your command automatically. The recommendation interval is every minute.

```cron
* * * * * warmup datuan.dev
```

For best practice, add another cronjob to warm up all URLs in sitemap in case any URL not warmed up yet. See more
at [Options](#options) section.

```cron
0 */12 * * *  warmup datuan.dev -a
* * * * *     warmup datuan.dev
```

You can also warm up multiple domains of course.

```cron
* * * * *     warmup http://domain1.com
*/2 * * * *   warmup domain2.net
*/5 * * * *   warmup domain3.xyz
```

## Options

Usage:

```shell
warmup datuan.dev <URL> <parameter>
```

| Parameter            | Description                                                                                                            | Default            |
|------------------	|---------------------------------------------------------------------------------------------------------------------	|-----------------	|
| `-a`, `--all`        | Warm up all URLs in sitemap                                                                                            | False            |
| `-r`, `--range`    | Only warm up URLs with `lastMod` newer than X seconds.<br> This parameters is ignored if `-a` (`--all`) is provided    | 300s (5 minutes)    |
| `-d`, `--delay`    | Delay (in milliseconds) between each warm up call.<br> If you using the low-end hosting, keep this value higher        | 500                |
| `--no-images`    | Disable images warm up                                                                                               | False                |
| `--no-css`    | Disable CSS warm up                                                                                               | False                |
| `--no-js`    | Disable Javascript warm up                                                                                               | False                |
| `--no-brotli`    | Disable Brotli compression warm up                                                                                               | False                |
| `-q`, `--quite`    | Suppress the debug log                                                                                                | False            |
| `-p`, `--purge`    | Purge resource before warm up                                                                                                | 0            |
| `-pd`, `--purgedelay`    | Delay (in milliseconds) after purging resource before warm up                                                                                                | 100            |
| `-pp`, `--purgepath`    | Path to purge resource using GET method before warm up                                                                                                | None            |
| `-h`, `--headers`    | Add custom headers                                                                                                | None            |

## Advanced options
### Custom request headers

```shell
warmup datuan.dev --headers.auth "Bearer super_secret" --headers.user-agent "My own crawler"
```

#### Securing Nginx purge cache module

Usually nginx geo module is used to only allow purging cache from certain IP addresses.
Sometimes IP of client that should PURGE cache is not known or during development/testing it's just easier to use a long secret token to allow purging cache.

Requires support for proxy_cache_purge or fastcgi_cache_purge.
Can be installed using nginx-extras on Ubuntu/Debian

```shell
apt install nginx-extras
```

##### Example Nginx config for Cache Purge using secret header and PURGE method

```shell
warmup datuan.dev --purge 1 --headers.x-purge "my_super_secret_token"
```

```nginx
http {
  # ...
  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m purger=on;

  map $http_x_purge $purge_allowed {
      my_super_secret_token  1;
      default 0;
  }
  # $purge_allowed is used to enable PURGE method instad of just setting PURGE to 1
  map $request_method $purge_method {
     PURGE   $purge_allowed;
     default 0;
  }

  server {
        listen      80;
        server_name www.example.com;

        location / {
            proxy_pass        https://localhost:8080;
            proxy_cache       my_cache;
            proxy_cache_purge $purge_method;
        }
    }
```

##### Example Nginx config for Cache Purge using secret header and custom GET path

This config can be used when PURGE method is not available or preferred.

For instance a WordPress site using nginx-helper plugin.
Nginx Helper plugin will only purge the cache for changed posts or pages.
Can use this module running using CRON to warm the purged items or entire site if changes have been made to theme templates that are used on many pages.  

```shell
warmup datuan.dev --purge 1 --purgepath "/purge/" --headers.x-purge "my_super_secret_token"
```

```nginx
http {
  # ...
  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m purger=on;
  proxy_cache_key "$scheme$request_method$host$request_uri";
  

  map $http_x_purge $purge_allowed {
      my_super_secret_token  1;
      default 0;
  }

  server {
        listen      80;
        server_name www.example.com;

        location / {
            proxy_pass        https://localhost:8080;
            proxy_cache       my_cache;
        }
        
        location ~ /purge(/.*) {
            if ($purge_allowed != 1) {
              return 403;
            }
            proxy_cache_purge my_cache "$scheme$request_method$host$1";
        }
    }
```

# Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/robman87"><img src="https://avatars.githubusercontent.com/u/5516214?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Robert Michalski</b></sub></a><br /><a href="https://github.com/tdtgit/sitemap-warmer/commits?author=robman87" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!