const fetch = require('node-fetch')
const Logger = require('logplease')
const logger = Logger.create('warmer')
const HTMLParser = require('node-html-parser')
const utils = require('./utilities')

class Warmer {
    constructor(sitemap, settings) {
        this.settings = settings

        this.accept_encoding = [];
        this.accept_encoding.br = 'gzip, deflate, br'
        this.accept_encoding.gzip = 'gzip, deflate'
        this.accept_encoding.deflate = 'deflate'

        this.accept = [];
        this.accept.avif = 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
        this.accept.webp = 'image/webp,image/apng,image/*,*/*;q=0.8'
        this.accept.default = 'image/apng,image/*,*/*;q=0.8'

        this.sitemap = sitemap
        this.url = this.sitemap.getURL(settings.newer_than)
        this.images = this.sitemap.getImages()
        this.assets = new Set()
    }

    async warmup() {
        if (Object.values(this.url).length === 0) {
            logger.info('📫 No URLs need to warm up. You might want to using parameter --range or --all. Using command `warmup -h` for more information.')
            return
        }

        if (this.settings.all) {
            logger.info('✅  Done. Prepare warming all URLs')
        }
        else {
            logger.info(`✅  Done. Prepare warming URLs newer than ${this.settings.newer_than}s (${utils.toHumans(this.settings.newer_than)})`)
        }

        for (const url of Object.keys(this.url)) {
            await this.warmup_site(url)
        }

        for (let image of this.images) {
            await this.warmup_image(image)
        }

        logger.info(`📫 Warming up all site's assets, stay tuned!`)

        for (let url of this.assets) {
            url = utils.tryValidURL(url, `${this.settings.sitemap.protocol}//${this.settings.sitemap.hostname}`)
            if (url !== false) {
                await this.warmup_site(url)
            }
        }

        logger.info(`📫 Done! Warm up total ${Object.values(this.url).length} URLs (included ${this.images.length} images) and ${this.assets.size} assets. Have fun!`)
    }

    async warmup_site(url) {
        logger.debug(`🚀 Warming ${url}`)
        for (const accept_encoding of Object.keys(this.accept_encoding)) {
            await this.fetch(url, {accept_encoding: this.accept_encoding[accept_encoding]})
            await this.sleep(this.settings.delay)
        }
    }

    async warmup_image(image_url) {
        logger.debug(`🚀📷 Warming ${image_url}`)
        for (const accept of Object.keys(this.accept)) {
            await this.fetch(image_url, {accept: this.accept[accept]})
            await this.sleep(this.settings.delay)
        }
    }

    async fetch(url, {accept = '', accept_encoding = ''}) {
        logger.debug(`  ⚡️ Warming ${url}`, accept, accept_encoding)
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
            if (this.settings.warmup_css === false && this.settings.warmup_js === false) {
                throw new Error('No need to parse HTML');
            }

            if (accept_encoding === 'deflate') {
                return data.text();
            }
        }).then(html => {
            if (accept_encoding === 'deflate') {
                this.html(html)
            }
        }).catch(e => {
            // Please be quite
        })
    }

    async sleep(millis) {
        return new Promise(resolve => setTimeout(resolve, millis))
    }

    html(html) {
        const root = HTMLParser.parse(html)

        if (this.settings.warmup_js) {
            const scripts = root.querySelectorAll('script[src]')
            scripts.forEach(elem => {
                this.assets.add(elem.attributes.src)
            })
        }

        if (this.settings.warmup_css) {
            const styles = root.querySelectorAll('link[href][rel="stylesheet"]')
            styles.forEach(elem => {
                this.assets.add(elem.attributes.href)
            })
        }
    }
}

module.exports = Warmer;
