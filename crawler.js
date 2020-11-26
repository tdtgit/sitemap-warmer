const SitemapXMLParser = require('sitemap-xml-parser');
const Sitemap = require('./sitemap');

const url = 'https://datuan.dev/sitemap.xml';

const options = {
    delay: 3000,
    limit: 5
};

const sitemapXMLParser = new SitemapXMLParser(url, options);

let site = new Sitemap();

sitemapXMLParser.fetch().then(urls => {
    urls.forEach(url => {
        site.addURL(url['loc'][0], site.toTimestamp(url['lastmod']))
        if (url['image:image']) {
            url['image:image'].forEach(image => {
                if (image['image:loc'][0]) {
                    site.addImage(url['loc'][0], image['image:loc'][0])
                }
            });
        }
    });
    console.log(site.urlFilter(604800))
});