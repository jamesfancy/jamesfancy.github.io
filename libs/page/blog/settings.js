/* jshint asi: true */
/* global define: false */
define(function(require) {
    var Settings = (function(series) {
        function Settings(json) {
            try {
                this.data = json ? JSON.parse(json) : {}
            } catch (err) {
                console.error(err)
                this.data = {}
            }
        }

        var p = Settings.prototype

        p.get = function(name) {
            return this.data[name]
        }

        p.getHeadingSeries = function(level) {
            var mark = (this.data.headings || {})["h" + level]
            return series.get(mark)
        }

        Settings.get = function(html) {
            var json = (html.match(/<!--\s*settings([\s\S]+?)-->/) || [])[1]
            return new Settings(json)
        }

        return Settings;
    })(require("./series"))

    return Settings
})
