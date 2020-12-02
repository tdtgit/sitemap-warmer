#!/usr/bin/env node
const url = require('url');
const SitemapXMLParser = require('sitemap-xml-parser');
const Sitemap = require('./sitemap');
const Warmer = require('./warmer');
const utils = require('./utilities');
const argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0' + ' domain.com')
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
    all: argv.all,
    sitemap: process.argv[2],
    newer_than: argv.range,
    delay: argv.delay,
    warmup_images: argv.images,
}

if(url.parse(settings.sitemap).protocol === null){
    settings.sitemap = new URL(`http://${settings.sitemap}`);
}

if(utils.validURL(settings.sitemap)){
    settings.sitemap = new URL(settings.sitemap);
}else {
    logger.error("Please specific an valid URL!");
    return;
}

if (settings.sitemap.pathname === '/') {
    settings.sitemap.pathname = '/sitemap.xml';
}

const sitemapXMLParser = new SitemapXMLParser(settings.sitemap.href, {delay: 3000});
logger.info(`📬 Getting sitemap from ${settings.sitemap.href}`)
sitemapXMLParser.fetch().then(urls => {
    let sitemap = new Sitemap();
    urls.forEach(url => {
        if (url['lastmod'] === null || url['lastmod'] === undefined) {
            url['lastmod'] = '2099-12-31T00:00:00'
        }
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
        logger.info('📫 No URLs need to warm up. You might want to using parameter --range or --all. Using command `warmup -h` for more information.')
    }
}).catch(() => {
    logger.error('❌  Failed! Please make sure the sitemap URL is correct.')
});