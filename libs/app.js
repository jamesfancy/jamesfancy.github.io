/* jshint asi: true */
/* global define: false */
define(function(require, exports, module) {
    require("jquery")
    var $ = jQuery

    require("stmd")
    var stmd = window.stmd

    function md2html(mdText) {
        var parser = new stmd.DocParser()
        var renderer = new stmd.HtmlRenderer()
        return renderer.render(parser.parse(mdText))
    }

    var app = {
        md2html: md2html,
        github: require("./app/github")(app)
    }

    return app
})
