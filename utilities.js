class Utilities {
    validURL(string) {
        try {
            new URL(string)
            return true
        }
        catch (err) {
            return false
        }
    }
}

const utils = new Utilities()

module.exports = utils