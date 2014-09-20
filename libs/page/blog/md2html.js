/* jshint asi: true */
/* global define: false */
define(function(require, exports, module) {
    var app = require("app")
    var $ = jQuery

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
            this.postHtml()
            this.jdom = $(this.html)
            this.post()

            return this.jdom
        }

        p.postHtml = function() {
            var pos = this.html.indexOf("[TOC]")
            if (pos < 0) {
                return
            }

            this.html = this.html.replace('[TOC]', '<div id="topic-of-content"></div>')
        }

        p.post = function() {
            var settings = require("./settings").get(this.html)
            var container = $("<div>").append(this.jdom)

            var headers = (function(Headers) {
                return new Headers($(":header", container))
            })(require("./headers"))

            headers.serialize(settings)

            !(function(toc) {
                if (toc.length === 0) {
                    return
                }

                var topics = headers.getTopics()

                var ul = $("<ul>")
                create(topics, ul)
                ul.appendTo(toc)

                function create(topics, ul) {
                    if (topics.length === 1 && !topics[0].text) {
                        // 这是虚主题（因为没有定义该主题，创建的一个用于连接下级主题的主题）

                        create(topics[0].children, ul)
                        return
                    }

                    topics.forEach(function(topic) {
                        if (topic.text) {
                            li = $("<li>").append(
                                $("<a>").attr("href", "#" + topic.id).text(topic.text)
                            ).appendTo(ul)
                        }

                        if (topic.children && topic.children.length) {
                            var subUl = li ? $("<ul>").appendTo(li) : ul
                            create(topic.children, subUl)
                        }
                    })
                }
            })($("#topic-of-content", container))
        }

        return Md2Html
    })()
})
