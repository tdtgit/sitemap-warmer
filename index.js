const SitemapXMLParser = require('sitemap-xml-parser');
const sitemapXMLParser = new SitemapXMLParser(process.argv[2], {delay: 3000});
const Sitemap = require('./sitemap');
const Warmer = require('./warmer');

const settings = {
    newer_than: 604800 * 2,
    delay: 100,
    disable_warmup_images: false,
}

console.log(`📬 Getting sitemap from ${process.argv[2]}`)
sitemapXMLParser.fetch().then(urls => {
    let sitemap = new Sitemap();
    urls.forEach(url => {
        sitemap.addURL(url['loc'][0], sitemap.toTimestamp(url['lastmod']))

        if (settings.disable_warmup_images === true) {
            return;
        }
        if (url['image:image']) {
            url['image:image'].forEach(image => {
                sitemap.addImage(url['loc'][0], image['image:loc'][0])
            });
        }
    });
    let warmup_urls = sitemap.filter(settings.newer_than);

    console.log(`✅  Done. Prepare warming...\n`)
    let warmer = new Warmer(warmup_urls, settings);
    warmer.warmup().then(() => {
        console.log(`\n📫 Done. Closing all. Have fun!`)
    });
}).catch(() => {
    console.log(`❌  Failed! Please make sure the sitemap URL is correct.`)
});