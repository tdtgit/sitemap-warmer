#!/usr/bin/env node
const url = require('url');
const SitemapXMLParser = require('sitemap-xml-parser');
const Sitemap = require('./sitemap');
const Warmer = require('./warmer');

const settings = {
    sitemap: process.argv[2],          // Domain of site need to warmup
    newer_than: 300,                   // Warm up all pages newer than 5 minutes
    delay: 500,                        // Delay between warm up, if you're
                                       // using hosting, please increase this
                                       // value to 1000 or 2000.
    disable_warmup_images: false,      // If you don't need to warm up images
}

if (url.parse(settings.sitemap).path === '/') {
    settings.sitemap = `${settings.sitemap}/sitemap.xml`;
}

const sitemapXMLParser = new SitemapXMLParser(settings.sitemap, {delay: 3000});
console.log(`📬 Getting sitemap from ${settings.sitemap}`)
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