import normalize_url from 'normalize-url'
import url from 'node:url'

class Utilities {
    isValidURL(string) {
        try {
            new URL(string)
            return true
        }
        catch (err) {
            return false
        }
    }

    tryValidURL(theUrl, hostname) {
        // Relative URL
        if (theUrl.indexOf('//') === -1 && theUrl.indexOf('/') === 0) {
            theUrl = new URL(theUrl, hostname).href
        }

        // Missing protocol URL. Must be placed after relative URL convert
        if (url.parse(theUrl).protocol === null) {
            theUrl = `https://${theUrl}`
        }

        if (this.isValidURL(theUrl)) {
            return this.normalizeURL(theUrl)
        }

        return false
    }

    normalizeURL(url) {
        return normalize_url(url, {
            stripHash: true,
            sortQueryParameters: true,
            removeTrailingSlash: false,
            stripWWW: false
        })
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
        ]
        let returnText = ''

        let i = 0, max = levels.length
        for (; i < max; i++) {
            if (levels[i][0] === 0) {
                continue
            }
            returnText += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length - 1) : levels[i][1]);
        }

        return returnText.trim()
    }
}

const utils = new Utilities()

export default utils
