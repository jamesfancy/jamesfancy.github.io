/* jshing asi: true */
/* global define: false */
define(function(require, exports, module) {
    var URL_BASE = "https://github.com/jamesfancy/jamesfancy.github.io/issues/"

    var app = require("app")
    require("shjs")
    var Md2Html = require("./md2html")

    var github = app.github;

    var blog = {
        title: $("#blog-title"),
        content: $("#blog-content"),
        comments: $("#comments"),
        highlight: function() {
            this.content.find("pre").each(function() {
                var pre = $(this)
                var code = pre.children("code")
                var lang = code.attr("class")
                if (lang && lang.match(/language\-/)) {
                    pre.addClass(lang.replace(/language\-/, "sh_"))
                }
            })

            sh_highlightDocument("../libs/lang/", ".min.js")
        },
        render: function(id, issue) {
            this.title.text(issue.title || "标题去哪儿啦——？")
            this.content.empty().append(new Md2Html(issue.body).toHtml())
            this.comments
                .text(issue.comments.toString() + " 条评论")
                .attr("href", URL_BASE + id + "#new_comment_field")
            this.highlight()
        }
    }

    return {
        show: function(id) {
            github.getIssue(id, function(error, json) {
                if (error) {
                    console.error(error)
                    return;
                }

                blog.render(id, json)
            })
        }
    }
})
