# DATUAN Sitemap Warmer

An CLI script built to help you warm up the website cache scan through the `sitemap.xml`. This utility help to warm up major encoding like `brotli
`, `gzip` and help warm up images by various encoding like AVIF, WebP.

![Plugin screenshot](https://datuan.dev/wp-content/uploads/2020/11/datuan-sitemap-warmer.jpg)

-----------------------------------------
Tài liệu Tiếng Việt bên dưới - Vietnamese below.

-----------------------------------------
![master](https://github.com/tdtgit/TDT-sitemap-warmer/workflows/Node.js%20CI/badge.svg) [![npm version](https://badge.fury.io/js/datuan-sitemap-warmer.svg)](https://www.npmjs.com/package/datuan-sitemap-warmer) [![Known Vulnerabilities](https://snyk.io/test/github/tdtgit/sitemap-warmer/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tdtgit/sitemap-warmer?targetFile=package.json) [![HitCount](http://hits.dwyl.com/tdtgit/sitemap-warmer.svg)](http://hits.dwyl.com/tdtgit/sitemap-warmer)

By default, this will warm up any URLs that newer than 5 minutes (300s) by checking the value of `<lastmod>` tag and any images inside URLs. If
 you want to test this plugin, try to update some posts or pages. The custom parameters to config the time range will come soon.
 
## Requirements
* NodeJS 10/12/14
* Ubuntu/CentOS/*nix or Windows/MacOS
* Website have and sitemap.xml. Example: https://datuan.dev/sitemap.xml. Tested and worked well with plugin [RankMath SEO](https://rankmath.com/kb/configure-sitemaps/) và [Yoast SEO](https://yoast.com/help/xml-sitemaps-in-the-wordpress-seo-plugin/).
 
## How to use
Install NodeJS and install the utility by command below:

```
npm install -g datuan-sitemap-warmer
```

Then you can  try to scan and warm up some sites using command below. Replace `datuan.dev` to your site's domain. 

```
warmup https://datuan.dev
```

For the best practice, you should setup a cronjob to run your command automatically. The recommendation interval is every minute.

```
* * * * * warmup https://datuan.dev
```

You can also warm up multiple domains of course.

```
* * * * * warmup https://domain1.com
*/2 * * * * warmup https://domain2.net
*/5 * * * * warmup https://domain3.xyz
```

## Options

Coming soon...

# Tài liệu tiếng Việt

Tiện ích giúp bạn làm ấm (warmup) cache một cách đơn giản và tiện dụng. Việc này khá quan trọng để đảm bảo tốc độ tốt nhất thay vì để người dùng
đầu tiên tự làm ấm. Tiện ích này tự động làm ấm tất cả các phiên bản HTML bao gồm `brotli`, `gzip` và hình ảnh bao gồm Avif, WebP.
 
Plugin hoạt động tốt nhất với nền tảng WordPress. Mặc định, tiện ích sẽ tự động kiểm tra những URL mới hơn 5 phút (300s) để tiến hành làm ấm. Nếu bạn
 muốn kiểm tra tiện ích có hoạt động hay không, hãy thử update một vài bài viết.

## Yêu cầu
* NodeJS 10/12/14
* Ubuntu/CentOS/*nix hoặc Windows/MacOS
* Website có sitemap.xml. Ví dụ: https://datuan.dev/sitemap.xml. Đã kiểm tra và hoạt động tốt nhất với các plugin WordPress như [RankMath SEO](https://rankmath.com/kb/configure-sitemaps/) và [Yoast SEO](https://yoast.com/help/xml-sitemaps-in-the-wordpress-seo-plugin/).

## Cách sử dụng
Cài đặt NodeJS, truy cập SSH vào máy chủ có hỗ trợ và chạy lệnh bên dưới:

```
npm install -g datuan-sitemap-warmer
```

Sau đó chạy lệnh này để kiểm tra. Có thể thay tên miền `datuan.dev` thành tên miền của bạn để có thể kiểm tra chính xác nhất.

```
warmup https://datuan.dev
```

Để warmup tự động mỗi phút, hãy cấu hình cron của máy chủ với dòng lệnh như bên dưới:

```
* * * * * warmup https://datuan.dev
```

Có thể dùng cho nhiều tên miền với nhiều khoảng thời gian khác nhau. Lưu ý thời gian mỗi lần chạy cron nên nhỏ hơn 5 phút.

```
* * * * * warmup https://domain1.com
*/2 * * * * warmup https://domain2.net
*/5 * * * * warmup https://domain3.xyz
```

## Cấu hình thêm

Đang phát triển...
