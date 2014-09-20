/* jshint asi: true */
/* global define: false */
define(function(require, exports, module) {
    var Series = (function() {
        function Series(first) {
            this.first = first
            this.point = ""
            this.reset()
        }

        Series.prototype.reset = function() {
            this.number = 0
            this.value = ""
            return this
        }

        Series.prototype.startWith = function(n) {
            this.number = parseInt(n) - 1
            return this
        }

        Series.prototype.next = function() {
            this.number++
            this.value = this.onConvert() || ""
            return this.get()
        }

        Series.prototype.get = function() {
            return this.value + this.point
        }

        Series.prototype.onConvert = function() {}

        return Series
    })()

    Series.empty = new Series("")

    var converters = {
        "一": (function() {
            var DIGITS = "零一二三四五六七八九".split("")
            DIGITS[0] = ""
            var UNITS = "个十百千万".split("")
            UNITS[0] = ""

            return {
                point: "、",
                onConvert: function() {
                    var n = this.number
                    if (n < 10) {
                        return DIGITS[n]
                    } else if (n < 20) {
                        return "十" + DIGITS[n % 10]
                    } else {
                        var s = ""
                        for (var i = 0, length = n.toString().length; i < length; i++) {
                            s = DIGITS[n % 10] + UNITS[i] + s
                            n = Math.floor(n / 10)
                        }

                        s = s.replace(/([十百千万])[十百千万]+/, "$1零")
                        return s
                    }
                }
            }
        })(),
        "1": {
            point: ". ",
            onConvert: function() {
                return this.number.toString()
            }
        },
        "1)": {
            point: " ",
            onConvert: function() {
                return this.number.toString() + ")"
            }
        }
    }

    $.extend(converters, (function() {
        // english letter
        var CHARS = "abcdefghijklmnopqrstuvwxyz".split("")

        function f(n) {
            var s = ""
            while (n > 0) {
                n--
                s = CHARS[n % 26] + s
                n = Math.floor(n / 26)
            }
            return s
        }

        return {
            "a": {
                point: ". ",
                onConvert: function() {
                    return f(this.number)
                }
            },
            "A": {
                point: ". ",
                onConvert: function() {
                    return f(this.number).toUpperCase()
                }
            }
        }
    })())

    $.extend(converters, (function() {
        // Roman numerals
        var L1 = "MCXI".split("")
        var L5 = "DLV".split("")

        function f(n) {
            var bits = (function(n) {
                console.log(n)
                var bits = []
                for (var i = 2; i >= 0; i--) {
                    bits[i] = n % 10
                    n = Math.floor(n / 10)
                }
                return bits
            })(Math.floor(n % 1000))

            function getRoman(i) {
                var bit = bits[i]

                if (bit === 9) {
                    return L1[i + 1] + L1[i]
                } else if (bit > 5) {
                    return L5[i] + new Array(bit - 5 + 1).join(L1[i + 1])
                } else if (bit === 5) {
                    return L5[i]
                } else if (bit === 4) {
                    return L1[i + 1] + L5[i]
                } else if (bit > 0) {
                    return new Array(bit + 1).join(L1[i + 1])
                } else {
                    return ""
                }
            }

            return (function() {
                var s = ""
                for (var i = 0; i < 3; i++) {
                    s += getRoman(i)
                }
                return s;
            })()
        }

        return {
            "I": {
                point: ". ",
                onConvert: function() {
                    return f(this.number)
                }
            },
            "i": {
                point: ". ",
                onConvert: function() {
                    return f(this.number).toLowerCase()
                }
            }
        }
    })())

    module.exports = {
        get: function(first) {
            var extra = converters[first];
            if (!extra) {
                return Series.empty;
            }

            var instance = new Series(first);
            return $.extend(instance, extra)
        }
    }
})
