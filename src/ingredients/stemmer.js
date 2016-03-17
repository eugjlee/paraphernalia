export const stemmer = function() {
    var e = { ational: "ate", tional: "tion", enci: "ence", anci: "ance", izer: "ize", bli: "ble", alli: "al", entli: "ent", eli: "e", ousli: "ous", ization: "ize", ation: "ate", ator: "ate", alism: "al", iveness: "ive", fulness: "ful", ousness: "ous", aliti: "al", iviti: "ive", biliti: "ble", logi: "log" },
        i = { icate: "ic", ative: "", alize: "al", iciti: "ic", ical: "ic", ful: "", ness: "" },
        t = "[^aeiou]",
        s = "[aeiouy]",
        a = t + "[^aeiouy]*",
        l = s + "[aeiou]*",
        n = "^(" + a + ")?" + l + a,
        o = "^(" + a + ")?" + l + a + "(" + l + ")?$",
        c = "^(" + a + ")?" + l + a + l + a,
        r = "^(" + a + ")?" + s;
    return function(t) {
        var l, u, x, $, p, v, g;
        if (t.length < 3) return t;
        if (x = t.substr(0, 1), "y" == x && (t = x.toUpperCase() + t.substr(1)), $ = /^(.+?)(ss|i)es$/, p = /^(.+?)([^s])s$/, $.test(t) ? t = t.replace($, "$1$2") : p.test(t) && (t = t.replace(p, "$1$2")), $ = /^(.+?)eed$/, p = /^(.+?)(ed|ing)$/, $.test(t)) {
            var f = $.exec(t);
            $ = new RegExp(n), $.test(f[1]) && ($ = /.$/, t = t.replace($, ""))
        } else if (p.test(t)) {
            var f = p.exec(t);
            l = f[1], p = new RegExp(r), p.test(l) && (t = l, p = /(at|bl|iz)$/, v = new RegExp("([^aeiouylsz])\\1$"), g = new RegExp("^" + a + s + "[^aeiouwxy]$"), p.test(t) ? t += "e" : v.test(t) ? ($ = /.$/, t = t.replace($, "")) : g.test(t) && (t += "e"))
        }
        if ($ = /^(.+?)y$/, $.test(t)) {
            var f = $.exec(t);
            l = f[1], $ = new RegExp(r), $.test(l) && (t = l + "i")
        }
        if ($ = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/, $.test(t)) {
            var f = $.exec(t);
            l = f[1], u = f[2], $ = new RegExp(n), $.test(l) && (t = l + e[u])
        }
        if ($ = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/, $.test(t)) {
            var f = $.exec(t);
            l = f[1], u = f[2], $ = new RegExp(n), $.test(l) && (t = l + i[u])
        }
        if ($ = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/, p = /^(.+?)(s|t)(ion)$/, $.test(t)) {
            var f = $.exec(t);
            l = f[1], $ = new RegExp(c), $.test(l) && (t = l)
        } else if (p.test(t)) {
            var f = p.exec(t);
            l = f[1] + f[2], p = new RegExp(c), p.test(l) && (t = l)
        }
        if ($ = /^(.+?)e$/, $.test(t)) {
            var f = $.exec(t);
            l = f[1], $ = new RegExp(c), p = new RegExp(o), v = new RegExp("^" + a + s + "[^aeiouwxy]$"), ($.test(l) || p.test(l) && !v.test(l)) && (t = l)
        }
        return $ = /ll$/, p = new RegExp(c), $.test(t) && p.test(t) && ($ = /.$/, t = t.replace($, "")), "y" == x && (t = x.toLowerCase() + t.substr(1)), t
    }
}();