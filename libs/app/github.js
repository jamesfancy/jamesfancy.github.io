/* jshint asi: true */
/* global define: false */
define(function(require, exports, module) {
    require("jquery")
    var $ = jQuery

    var app
    var API_BASE = "https://api.github.com/repos/jamesfancy/jamesfancy.github.io/"

    function api() {
        return API_BASE + [].slice.call(arguments, 0).join("/")
    }

    function call(callback) {
        if (typeof callback === "function") {
            callback.apply(null, [].slice.call(arguments, 1))
        }
    }

    function jsonApi(method, url, data, callback) {
        if (typeof data === "function") {
            callback = data
            data = null
        }

        $.ajax(url, {
            type: method || "get",
            dataType: "json",
            data: data
        }).done(function(json) {
            call(callback, null, json)
        }).fail(function(xhr) {
            call(callback, xhr || {})
        })
    }

    var github = {
        getIssue: function(id, callback) {
            jsonApi("get", api("issues", id), callback)
        },
        getComment: function() {

        }
    }

    return function(_app) {
        app = app
        return github
    }
})
