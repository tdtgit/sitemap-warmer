# TDT Sitemap Warmer
![master](https://github.com/tdtgit/TDT-sitemap-warmer/workflows/.github/workflows/node.js.yml/badge.svg)

Tiện ích giúp bạn làm ấm (warmup) cache một cách đơn giản và tiện dụng. Việc này khá quan trọng để đảm bảo tốc độ tốt nhất thay vì để người dùng đầu tiên tự làm ấm. Tiện ích này tự động làm ấm tất cả các phiên bản HTML bao gồm `brotli`, `gzip` và hình ảnh bao gồm AVIF, WEBP.

## Yêu cầu
* NodeJS 10/12/14
* Ubuntu/CentOS/*nix
* Trang có sitemap.xml. Ví dụ: https://datuan.dev/sitemap.xml. Đã kiểm tra và hoạt động với [RankMath SEO](https://rankmath.com/kb/configure-sitemaps/) và [Yoast SEO](https://yoast.com/help/xml-sitemaps-in-the-wordpress-seo-plugin/).

## Cách sử dụng
Cài đặt NodeJS, truy cập SSH vào máy chủ có hỗ trợ và chạy lệnh bên dưới:

```
npm install -g datuan-sitemap-warmer
```

Sau đó chạy lệnh này để kiểm tra. Có thể thay tên miền `datuan.dev` thành tên miền của bạn để có thể kiểm tra chính xác nhất.

```
datuan-warmup https://datuan.dev
```

Để warmup tự động mỗi phút, hãy cấu hình cron của máy chủ với dòng lệnh như bên dưới:

```
* * * * * datuan-warmup https://datuan.dev
```

Có thể dùng cho nhiều tên miền với nhiều khoảng thời gian khác nhau:

```
* * * * * datuan-warmup https://domain1.com
*/5 * * * * datuan-warmup https://domain2.net
*/15 * * * * datuan-warmup https://domain3.xyz
```