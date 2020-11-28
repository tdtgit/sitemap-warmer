#!/usr/bin/env node
const url = require('url');
const SitemapXMLParser = require('sitemap-xml-parser');
const Sitemap = require('./sitemap');
const Warmer = require('./warmer');
const argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0' + ' https://domain.com')
    .alias('h', 'help')

    .alias('r', 'range')
    .describe('range', 'Only warm up URLs with lastModified newer than this value (in seconds). Default: 300s (5' +
        ' minutes)')
    .default('range', 300)

    .alias('d', 'delay')
    .describe('delay', 'Delay (in miliseconds) between each warm up call. If you using the low-end hosting, keep this' +
        ' value higher. Default: 500ms')
    .default('delay', 500)

    .alias('i', 'images')
    .describe('images', 'Enable images warm up. Default: true')
    .default('images', true)

    .alias('a', 'all')
    .describe('all', 'Ignore --range parameter and warm up all URLs in sitemap')

    .alias('q', 'quite')
    .describe('quite', 'Disable debug logging if you feel it\'s too much')

    .argv;
const Logger = require('logplease');
const logger = Logger.create('main');

if (argv.quite) {
    Logger.setLogLevel(Logger.LogLevels.INFO)
}

const settings = {
    // Warm up all
    all: argv.all,
    // Domain of site need to warmup
    sitemap: process.argv[2],
    // Warm up all pages newer than 5 minutes
    newer_than: argv.range,
    // Delay between warm up, if you're using hosting, please increase this
    // value to 1000 or 2000.
    delay: argv.delay,
    // In case you don't need to warm up images
    warmup_images: argv.images,
}

if (url.parse(settings.sitemap).path === '/') {
    settings.sitemap = `${settings.sitemap}/sitemap.xml`;
}

const sitemapXMLParser = new SitemapXMLParser(settings.sitemap, {delay: 3000});
logger.info(`📬 Getting sitemap from ${settings.sitemap}`)
sitemapXMLParser.fetch().then(urls => {
    let sitemap = new Sitemap();
    urls.forEach(url => {
        sitemap.addURL(url['loc'][0], sitemap.toTimestamp(url['lastmod']))

        if (settings.warmup_images === false) {
            return;
        }

        if (url['image:image']) {
            url['image:image'].forEach(image => {
                sitemap.addImage(url['loc'][0], image['image:loc'][0])
            });
        }
    });

    let warmup_urls = settings.all ? sitemap.all() : sitemap.filter(settings.newer_than);

    if (settings.all) {
        logger.info('✅  Done. Prepare warming all URLs');
    }
    else {
        logger.info(`✅  Done. Prepare warming URLs newer than ${settings.newer_than}s (${sitemap.toHumans(settings.newer_than)})`);
    }

    if (Object.values(warmup_urls).length > 1) {
        let warmer = new Warmer(warmup_urls, settings);
        warmer.warmup().then(() => {
            logger.info(`\n📫 Done! Warm up total ${Object.values(warmup_urls).length} URLs. Have fun!`)
        });
    }
    else {
        logger.info('📫 No URLs need to warm up. You might want to change your --range or using --all.')
    }
}).catch(() => {
    logger.error('❌  Failed! Please make sure the sitemap URL is correct.')
});