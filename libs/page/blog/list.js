/* jshint asi: true */
/* global define: false */
define(function(require) {
    var app = require("app")
    var github = app.github;

    var blogContent = $("#blog-content")

    function render(list) {
        if (!$.isArray(list)) {
            return
        }

        blogContent.children("h3").remove()

        list.forEach(function(issue) {
            if (issue.user.login !== "jamesfancy") {
                return
            }

            $("<div>").addClass("topic-link").append(
                $("<span>").addClass("comments").text("评论"),
                $("<span>").addClass("value").text(issue.comments || 0),
                $("<a>").attr("href", "../blog/#" + issue.number)
                    .text(issue.title)
            ).appendTo(blogContent)
        })
    }

    function show(page) {
        github.getIssues(page || 1, function(error, json) {
            if (error) {
                console.error(error)
                return
            }

            render(json)
        })
    }

    return {
        show: function() {
            show()
        }
    }
})
