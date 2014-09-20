/* jshint asi: true */
/* global define: false */
define(function(require, exports, module) {
    var app = require("app")
    var $ = jQuery
    var series = require("./series")

    window.s = series

    var Settings = (function() {
        function Settings(json) {
            this.data = JSON.parse(json)
        }

        var p = Settings.prototype

        p.get = function(name) {
            return this.data[name]
        }

        p.getHeadingSeries = function(tagName) {
            (this.data.headings || {})[tagName.toLowerCase()]
        }

        Settings.get = function(html) {
            var json = (html.match(/<!--\s*settings([\s\S]+?)-->/) || [])[1]
            return new Settings(json)
        }

        return Settings;
    })()

    module.exports = (function() {
        function Md2Html(md) {
            this.md = md
        }

        var p = Md2Html.prototype

        p.pre = function() {
            // nothing
        }

        p.toHtml = function() {
            this.pre()
            this.html = app.md2html(this.md)
            this.jdom = $(this.html)
            this.post()

            return this.jdom
        }

        p.post = function() {
            var settings = Settings.get(this.html)
            var jdom = this.jdom
            var wrappred = $("<div>").append(jdom)

            !(function(headings) {
                if (!headings) {
                    return;
                }

                $(":header", wrappred).each(function() {
                    var h = $(this)
                    var tagName = h[0].tagName.toLowerCase()
                })
            })(settings.get("headings"))
        }

        return Md2Html
    })()
})
