/* jshing asi: true */
/* global define: false */
define(function(require, exports, module) {
    var app = require("app")
    var github = app.github;

    var Md2Html = require("./md2html")

    require("shjs")
    function highlight() {
        sh_highlightDocument("lang/", ".min.js")
    }

    var blog = {
        title: $("#blog-title"),
        content: $("#blog-content"),
        render: function(issue) {
            this.title.text(issue.title || "标题去哪儿啦——？")
            this.content.html(new Md2Html(issue.body).toHtml())
        }
    }

    return {
        show: function(id) {
            console.log("id", id)
            github.getIssue(id, function(error, json) {
                if (error) {
                    console.error(error)
                    return;
                }

                blog.render(json)
            })
        }
    }
})
