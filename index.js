const SitemapXMLParser = require('sitemap-xml-parser');
const Sitemap = require('./sitemap');
const Warmer = require('./warmer');

const sitemapXMLParser = new SitemapXMLParser(
    'https://datuan.dev/sitemap.xml',
    {
        delay: 3000,
        limit: 5
    });

console.log(`📬 Getting sitemap from https://datuan.dev/sitemap.xml`)
sitemapXMLParser.fetch().then(urls => {
    let sitemap = new Sitemap();
    urls.forEach(url => {
        sitemap.addURL(url['loc'][0], sitemap.toTimestamp(url['lastmod']))
        if (url['image:image']) {
            url['image:image'].forEach(image => {
                if (image['image:loc'][0]) {
                    sitemap.addImage(url['loc'][0], image['image:loc'][0])
                }
            });
        }
    });
    let warmup_urls = sitemap.filter(604800 * 2);

    console.log(`✅  Done. Prepare warming...\n`)
    let warmer = new Warmer(warmup_urls);
    warmer.warmup().then(() => {
        console.log(`\n📫 Done. Closing all. Have fun!`)
    });
});