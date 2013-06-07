// Javascript Regular Expressions with jQuery Contains Regex Extension
// http://pastebin.com/1J99u64N
// https://gist.github.com/Mottie/461488

$.extend( $.expr[":"], {
    containsRegex: $.expr.createPseudo ?
        $.expr.createPseudo(function(text) {
            var reg = /^\/((?:\\\/|[^\/])+)\/([mig]{0,3})$/.exec(text);
            return function(elem) {
                return reg ? RegExp(reg[1], reg[2]).test($.trim(elem.innerHTML)) : false;
            };
        }) :
        // support: jQuery <1.8
        function(elem, i, match) {
            var reg = /^\/((?:\\\/|[^\/])+)\/([mig]{0,3})$/.exec(match[3]);
            return reg ? RegExp(reg[1], reg[2]).test($.trim(elem.innerHTML)) : false;
        }
});
