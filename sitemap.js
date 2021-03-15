Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter(key => predicate(obj[key]))
        .reduce((res, key) => (res[key] = obj[key], res), {})

class Sitemap {
    constructor() {
        this.urls = []
    }

    addURL(url, lastMod) {
        this.urls[url] = []
        this.urls[url].lastMod = lastMod
        this.urls[url].images = []
    }

    addImage(url, image) {
        this.urls[url].images.push(image)
    }

    all() {
        return this.urls
    }

    filter(seconds) {
        return Object.filter(this.urls, url => Math.round(Date.now() / 1000) - url.lastMod < seconds)
    }

    toTimestamp(strDate) {
        let datum = Date.parse(strDate)
        return datum / 1000
    }

    // https://stackoverflow.com/a/34270811/8329480
    toHumans(seconds) {
        const levels = [
            [Math.floor(seconds / 31536000), 'years'],
            [Math.floor((seconds % 31536000) / 86400), 'days'],
            [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
            [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
            [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
        ];
        let returnText = '';

        let i = 0, max = levels.length;
        for (; i < max; i++) {
            if (levels[i][0] === 0) {
                continue;
            }
            returnText += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length - 1) : levels[i][1]);
        }

        return returnText.trim();
    }
}

module.exports = Sitemap