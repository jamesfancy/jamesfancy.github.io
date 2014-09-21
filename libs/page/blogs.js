/* jshint asi: true */
/* global define: false */
define(function(require) {
    require("jquery")
    var $ = jQuery

    $(document).on("selectstart", false)

    require("./blog/list").show()
})
