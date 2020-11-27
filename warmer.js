const fetch = require("node-fetch");

class Warmer {
    constructor(urls) {
        this.site_delay = 200;
        this.image_delay = 100;

        this.accept_encoding = [];
        this.accept_encoding.br = 'gzip, deflate, br';
        this.accept_encoding.gzip = 'gzip, deflate';
        this.accept_encoding.deflate = 'deflate';

        this.accept = [];
        this.accept.avif = 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8';
        this.accept.webp = 'image/webp,image/apng,image/*,*/*;q=0.8';
        this.accept.normal = 'image/apng,image/*,*/*;q=0.8';

        this.url = urls;
    }

    async warmup() {
        for (const url of Object.keys(this.url)) {
            await this.warmup_site(url);
            if (this.url[url]['images'] && this.url[url]['images'].length > 0) {
                await this.warmup_images(this.url[url]['images']);
            }
        }
    }

    async warmup_site(url) {
        console.log(`\n🚀 Warming ${url}`);
        for (const accept_encoding of Object.keys(this.accept_encoding)) {
            await this.fetch(url, '', this.accept_encoding[accept_encoding]);
            await this.sleep(this.site_delay)
        }
    }

    async warmup_image(image_url) {
        console.log(`    🚀📷 Warming ${image_url}`);
        for (const accept of Object.keys(this.accept)) {
            await this.fetch(image_url, this.accept[accept], '')
            await this.sleep(this.image_delay)
        }
    }

    async warmup_images(images) {
        console.log(`  💁 This page have ${images.length} 📷 images`);
        for (const image of images) {
            await this.warmup_image(image)
        }
    }

    async fetch(url, accept, accept_encoding) {
        console.log(`      ⚡️ Warming accept: ${accept}; accept-encoding: ${accept_encoding} for ${url}`);
        return await fetch(url, {
            "headers": {
                "accept": accept,
                "accept-encoding": accept_encoding,
                "cache-control": "no-cache",
                "pragma": "no-cache",
            },
            "body": null,
            "method": "GET",
            "mode": "cors"
        });
    }

    async sleep(millis) {
        return new Promise(resolve => setTimeout(resolve, millis));
    }
}

module.exports = Warmer;