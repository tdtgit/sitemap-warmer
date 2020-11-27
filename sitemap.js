Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter(key => predicate(obj[key]))
        .reduce((res, key) => (res[key] = obj[key], res), {});

class Sitemap {
    constructor() {
        this.urls = [];
    }

    addURL(url, lastMod) {
        this.urls[url] = [];
        this.urls[url].lastMod = lastMod;
        this.urls[url].images = [];
    }

    addImage(url, image) {
        this.urls[url].images.push(image);
    }

    filter(seconds) {
        return Object.filter(this.urls, url => Math.round(Date.now() / 1000) - url.lastMod < seconds)
    }

    toTimestamp(strDate) {
        let datum = Date.parse(strDate);
        return datum / 1000;
    }
}

module.exports = Sitemap;