/* jshing asi: true */
/* global define: false */
define(function(require, exports, module) {
    require("jquery")
    var $ = jQuery

    $(document).on("selectstart", false)

    $(window).on("hashchange", function() {
        var hash = location.hash
        var id = hash.match(/^#(.*)/) ? RegExp.$1 : ""
        if (id) {
            require("./blog/issue").show(id)
        } else {
            require("./blog/list").show()
        }
    }).trigger("hashchange")
})
