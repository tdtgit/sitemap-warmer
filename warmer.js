const fetch = require('node-fetch')
const Logger = require('logplease')
const logger = Logger.create('warmer')
const HTMLParser = require('node-html-parser')
const utils = require('./utilities')

class Warmer {
    constructor(urls, options) {
        this.site_delay = options.delay
        this.image_delay = options.delay

        this.accept_encoding = [];
        this.accept_encoding.br = 'gzip, deflate, br';
        this.accept_encoding.gzip = 'gzip, deflate';
        this.accept_encoding.deflate = 'deflate';

        this.accept = [];
        this.accept.avif = 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
        this.accept.webp = 'image/webp,image/apng,image/*,*/*;q=0.8'
        this.accept.default = 'image/apng,image/*,*/*;q=0.8'

        this.url = urls
        this.assets = new Set();
    }

    async warmup() {
        for (const url of Object.keys(this.url)) {
            await this.warmup_site(url)
            if (this.url[url]['images'] && this.url[url]['images'].length > 0) {
                await this.warmup_images(this.url[url]['images'])
            }
        }

        for (let url of this.assets) {
            if (utils.validURL(url) === false) {
                url = new URL(url, 'https://datuan.dev').href;
            }
            await this.warmup_site(url)
        }

        logger.info(`📫 Done! Warm up total ${Object.values(this.url).length} URLs and ${this.assets.size} assets. Have fun!`)
    }

    async warmup_site(url) {
        logger.debug(`🚀 Warming ${url}`)
        for (const accept_encoding of Object.keys(this.accept_encoding)) {
            await this.fetch(url, {accept_encoding: this.accept_encoding[accept_encoding]})
            await this.sleep(this.site_delay)
        }
    }

    async warmup_image(image_url) {
        logger.debug(`    🚀📷 Warming ${image_url}`);
        for (const accept of Object.keys(this.accept)) {
            await this.fetch(image_url, {accept: this.accept[accept]})
            await this.sleep(this.image_delay)
        }
    }

    async warmup_images(images) {
        logger.debug(`  💁 This page have ${images.length} 📷 images`)
        for (const image of images) {
            await this.warmup_image(image)
        }
    }

    async fetch(url, {accept = '', accept_encoding = ''}) {
        logger.debug(`      ⚡️ Warming ${url}`, accept, accept_encoding)
        return await fetch(url, {
            "headers": {
                "accept": accept,
                "accept-encoding": accept_encoding,
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "user-agent": 'datuan.dev - Cache Warmer (https://github.com/tdtgit/sitemap-warmer)'
            },
            "body": null,
            "method": "GET",
            "mode": "cors"
        }).then(data => {
            if (accept_encoding === 'deflate') {
                return data.text();
            }
        }).then(html => {
            if (accept_encoding === 'deflate') {
                this.html(html)
            }
        });
    }

    async sleep(millis) {
        return new Promise(resolve => setTimeout(resolve, millis))
    }

    async html(html) {
        const root = HTMLParser.parse(html)
        const scripts = root.querySelectorAll('script');
        scripts.forEach(elem => {
            if (elem.attributes.src) {
                this.assets.add(elem.attributes.src)
            }
        })

        const styles = root.querySelectorAll('link');
        styles.forEach(elem => {
            if (elem.attributes.rel === 'stylesheet' && elem.attributes.href) {
                this.assets.add(elem.attributes.href)
            }
        })
    }
}

module.exports = Warmer;