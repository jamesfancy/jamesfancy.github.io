/* jshint asi: true */
/* global define: false */
define(function(require, exports, module) {
    require("jquery")
    var $ = jQuery

    $(document).on("selectstart", false)

    var rss = "http://jamesfancy.blog.51cto.com/rss.php?uid=2516291"
    console.log(rss)
})
