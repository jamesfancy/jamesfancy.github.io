/* jshing asi: true */
/* global define: false */
define(function(require, exports, module) {
    var app = require("app")
    console.log("jquery", $, jQuery)

    var github = app.github;

    var blog = {
        title: $("#blog-title"),
        content: $("#blog-content"),
        render: function(issue) {
            this.title.text(issue.title || "标题去哪儿啦——？")
            this.content.html(app.md2html(issue.body))
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
