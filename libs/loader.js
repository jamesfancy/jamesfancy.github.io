/* jshint asi: true */
void function() {
    var config = {
        seajs: "http://cdnjs.cloudflare.com/ajax/libs/seajs/2.3.0/sea-debug.js",
        seaConfig: {
            // get base in following scripts
            base: "",
            alias: {
                jquery: "http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js",
                shjs: "sh_main.min.js"
            },
        }
    }

    var loaderScript = function() {
        var scripts = document.scripts
        var current = scripts[scripts.length - 1]

        var url = current.hasAttribute
            ? current.src
            // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
            : current.getAttribute("src", 4)

        config.seaConfig.base = url.match(/[^?#]*\//)[0]

        return current
    }()

    function loadSeajs(callback) {
        var doc = document || window.document

        var script = doc.createElement("script")
        addOnLoad(script, callback)
        script.async = true
        script.src = config.seajs

        var head = doc.head || doc.getElementsByTagName("head")[0]
        head.appendChild(script)

        function addOnLoad(el, callback) {
            if ("onload" in el) {
                el.onload = onLoad
                el.onerror = function() {
                    onLoad(true)
                }
            } else {
                el.onreadystatechange = function() {
                    if (/loaded|complete/.test(el.readyState)) {
                        onLoad()
                    }
                }
            }

            function onLoad(isErr) {
                el.onload = el.onerror = el.onreadystatechange = null
                head.removeChild(el)
                el = null
                callback(isErr)
            }
        }
    }

    var loader = {
        isReady: false,
        callbacks: [],
        done: function() {
            this.isReady = true
            this.entry()
            this.check()
        },
        entry: function() {
            var module = loaderScript.getAttribute("data-entry")
            if (module) {
                seajs.use(["page/" + module])
            }
        },
        check: function() {
            if (!this.isReady) {
                return
            }

            for (var i = 0, length = this.callbacks.length; i < length; i++) {
                this.callbacks[i].apply(this.export)
            }
        },
        exports: {
            ready: function(callback) {
                if (typeof callback !== "function") {
                    return;
                }

                loader.callbacks.push(callback)
                loader.check()
            }
        }
    }

    loadSeajs(function(isErr) {
        if (isErr === true) {
            console.error("cannot load SeaJS")
            return
        }

        seajs.config(config.seaConfig)
        loader.done()
    });

    window.loader = loader.exports
}()
