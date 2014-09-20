/* jshint asi: true */
/* global define: false */
define(function(require) {
    require("app")

    var LevelStack = (function() {
        function LevelStack() {
            this.stack = []
        }

        var p = LevelStack.prototype

        p.get = function(level) {
            return this.stack[level]
        }

        p.create = function(level) {
            return {
                level: level
            }
        }

        p.goLevel = function(level) {
            var stack = this.stack
            var start = stack.length
            stack.length = level + 1

            !(function(self, start) {
                if (start >= stack.length) {
                    return
                }

                for (var i = start; i < stack.length; i++) {
                    stack[i] = self.create(i)
                }
            })(this, start)

            return this.get(level)
        }

        return LevelStack
    })()

    function Headers(headers) {
        this.headers = headers
    }

    var p = Headers.prototype

    p.serialize = function(settings) {
        var headers = this.headers
        var stack = new LevelStack()

        stack.create = function(level) {
            return settings.getHeadingSeries(level)
        }

        headers.each(function() {
            var h = $(this)
            var level = parseInt(h[0].tagName[1])
            var series = stack.goLevel(level)
            h.text(series.next() + h.text())
        })
    }

    p.getTopics = function(isRefresh) {
        if (this.topics && !isRefresh) {
            return this.topics
        }

        this.topics = (function(headers) {
            var stack = new LevelStack()
            stack.create = function(level) {
                var nodes = []

                if (level === 0) {
                    nodes.id = "heading"
                } else {
                    var upLevel = this.get(level - 1)
                    var parent = upLevel[upLevel.length - 1]
                    if (!parent) {
                        parent = {
                            id: upLevel.id + "_" + upLevel.length
                        }
                        upLevel.push(parent)
                    }
                    nodes.id = parent.id
                    parent.children = nodes
                }

                return nodes
            }

            headers.each(function() {
                var h = $(this)
                var level = parseInt(h[0].tagName[1])
                var nodes = stack.goLevel(level)
                var node = {
                    id: nodes.id + "_" + nodes.length,
                    text: h.text()
                }
                h.attr("id", node.id)
                nodes.push(node)
            })

            return stack.get(0)
        })(this.headers)

        return this.topics
    }

    return Headers
})
