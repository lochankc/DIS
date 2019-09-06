"use strict";
angular.module("ccue.session", []).provider("$session", function() {
    var t, e = localStorage;
    this.prefix = function(e) {
        t = e
    }, this.$get = [function() {
        if (!t) throw new Error("must specify a storage prefix");
        return {
            get: function(r) {
                return r = t + r, angular.fromJson(e.getItem(r))
            },
            set: function(r, n) {
                if ("undefined" != typeof n) return r = t + r, e.setItem(r, angular.toJson(n))
            },
            unset: function(r) {
                return r = t + r, e.removeItem(r)
            },
            clear: function() {
                for (var r, n = e.length - 1; n >= 0; n--) r = e.key(n), r.startsWith(t) && e.removeItem(r)
            }
        }
    }]
}), angular.module("org", ["ngResource", "ccue.session"]), angular.module("org").provider("org.resource", function() {
    var t;
    this.url = function(e) {
        t = e
    }, this.$get = ["$resource", function(e) {
        if (!t) throw new Error("Must configure org.resource.url");
        return e(t, {}, {
            get: {
                method: "GET",
                params: {
                    id: "@id"
                }
            }
        })
    }]
}), angular.module("org").service("organization", ["$rootScope", "$q", "$session", "org.resource", function(t, e, r, n) {
    function o(t) {
        return t ? t.replace(/\$/g, "$$$$") : void 0
    }

    function a() {
        return c || (c = n.get({
            id: o(l)
        }).$promise, c.then(i).then(s), c.then(u)), c
    }

    function i(t) {
        l = t.name
    }

    function s() {
        c = void 0
    }

    function u(e) {
        t.$broadcast("orgChange", e)
    }
    var c, l;
    this.use = function(t) {
        return arguments.length < 1 ? l : (l = t, void a())
    }, this.get = function() {
        return a()
    }
}]), angular.module("org.translate", ["ngCookies", "org", "pascalprecht.translate"]), angular.module("org.translate").provider("org.translate.resolver", function() {
    var t = "JLOCALE";
    this.cookieName = function(e) {
        t = e
    }, this.$get = ["$cookies", "$translate", function(e, r) {
        function n() {
            return e.get(t) || "unknown"
        }
        var o = function(t) {
            if (Object.keys(t).length < 1) throw new Error("message catalog must contain at least one value");
            this.catalog = t
        };
        return o.prototype.resolve = function() {
            var t = n();
            if (this.lang === t && this.hasOwnProperty("resolved")) return this.resolved;
            var e = this.lang = t;
            if (this.catalog[e]) return this.resolved = this.catalog[e];
            if (e.indexOf("-") > 0 && (e = e.split("-")[0], this.catalog[e])) return this.resolved = this.catalog[e];
            if (r.fallbackLanguage() !== e && (e = r.fallbackLanguage(), this.catalog[e])) return this.resolved = this.catalog[e];
            var o = Object.keys(this.catalog).first();
            return this.resolved = this.catalog[o]
        }, o
    }]
}), angular.module("org.translate").constant("org.translate.SUPPORTED_FIELDS", ["portalTitle", "portalWelcomeMsg", "portalFooterMsg", "disclaimerText"]), angular.module("org.security", ["org", "pascalprecht.translate"]), angular.module("org.security").directive("securityBanner", function() {
    return {
        template: '<div ng-if="org.securityLevel" ng-class="org.securityLevel | securityClass" class="security-banner text-center p--"><h4><strong>{{ org.securityLevel | securityLabel }}</strong></h4></div>',
        restrict: "E",
        replace: !1,
        scope: !0,
        controller: ["$scope", "organization", function(t, e) {
            function r(e) {
                t.org = e
            }
            e.get().then(r), t.$on("orgChange", r)
        }]
    }
}), angular.module("org.security").filter("securityClass", function() {
    return function(t) {
        return t ? t.toLowerCase().replace(/\W+|_/g, "-") : ""
    }
}), angular.module("org.security").filter("securityLabel", ["$translate", function(t) {
    return function(e) {
        if (!e) return "";
        var r = "security.labels.".concat(e.toUpperCase()),
            n = t.instant(r);
        return n === r && (n = e.toUpperCase()), n
    }
}]), angular.module("theme.modal", []).directive("revealModal", ["$document", "$timeout", function(t, e) {
    function r(t) {
        var r = n.length ? n[n.length - 1] : void 0,
            o = t.target;
        r && (r[0] === o || r.has(o).length || e(function() {
            var t = r.find("[autofocus]")[0] || r.find(":input,a").not("close-reveal-modal")[0];
            t ? t.focus() : angular.element(o).not("body").blur()
        }))
    }
    var n = [];
    return t.find("body").on("focusin", r), {
        restrict: "C",
        link: function(r, o) {
            n.push(o), r.$on("$destroy", function() {
                n = n.filter(function(t) {
                    return t !== o
                })
            }), e(function() {
                t.find(":focus").not("body").blur()
            })
        }
    }
}]);