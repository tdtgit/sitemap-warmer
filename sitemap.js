Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter(key => predicate(obj[key]))
        .reduce((res, key) => (res[key] = obj[key], res), {})

const utils = require('./utilities')

class Sitemap {
    constructor(settings) {
        this.settings = settings

        this.urls = []
        this.images = [];
    }

    addURL(url) {
        if (url['lastmod'] === null || url['lastmod'] === undefined) {
            url['lastmod'] = '2099-12-31T00:00:00'
        }

        let urlLastMod = utils.toTimestamp(url['lastmod'])

        if (this.shouldWarmup(urlLastMod) === false) {
            return
        }

        let normalizeURL = utils.tryValidURL(url['loc'][0])
        if (normalizeURL === false) {
            return
        }

        this.urls[normalizeURL] = []
        this.urls[normalizeURL].lastMod = urlLastMod

        if (url['image:image']) {
            url['image:image'].forEach(image => {
                this.addImage(image['image:loc'][0])
            })
        }
    }

    addImage(image) {
        if (this.settings.warmup_images === false) {
            return
        }
        if (this.images.indexOf(image) === -1) {
            this.images.push(image);
        }
    }

    getURL() {
        return this.urls
    }

    getImages() {
        return this.images
    }

    shouldWarmup(lastMod) {
        if (this.settings.all === true) {
            return true
        }
        return Math.round(Date.now() / 1000) - lastMod < this.settings.newer_than
    }
}

module.exports = Sitemap
