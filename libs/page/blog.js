/* jshint asi: true */
/* global define: false */
define(function(require) {
    require("jquery")
    var $ = jQuery

    $(window).on("hashchange", function() {
        var hash = location.hash
        var id = hash.match(/^#(.*)/) ? RegExp.$1 : ""
        if (id) {
            if (id.match(/^\d+$/)) {
                // only number hash is blog id
                require("./blog/issue").show(id)
            }
        } else {
            require("./blog/list").show()
        }
    }).trigger("hashchange")

    $(document).on("selectstart", false)

    var scrollPanel = $("#blog-content").parent()
    $("#blog-content").on("click", "a", function(e) {
        var href = $(this).attr("href")
        if (href.match(/^#\d+$/)) {
            return
        }

        e.preventDefault()
        scrollPanel.scrollTop(scrollPanel.scrollTop() + $(href).position().top - 32)
    })
})
