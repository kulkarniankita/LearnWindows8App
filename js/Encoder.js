js.Encoder = (function create_Encoder() {

    //Very simple URL Encoding and Decoding
    var url = {
        encode: function (string) {
            return string.replace(/./g, function (chr, index) {
                return chr.match(/[\w\d]/) ? chr : "%" + chr.charCodeAt(0).toString(16).toUpperCase();
            });
        },
        decode: function (string) {
            return string.replace(/%[0-9A-Fa-f]{2}/g, function (text, index) {
                return String.fromCharCode(parseInt(text.substring(1), 16));
            });
        }
    };

    //Simple HTML Encoding and Decoding
    var html = {
        encode: function (string) {
            return string.replace(/./g, function (chr, index) {
                return chr.match(/[\w\d]/) ? chr : "&#" + chr.charCodeAt(0) + ";";
            });
        },
        decode: function (string) {
            return string.replace(/&#[0-9]+;/g, function (text, index) {
                return String.fromCharCode(text.match(/[0-9]+/)[0]);
            });
        }
    };

    return {
        encodeUrl: url.encode,
        decodeUrl: url.decode,
        encodeHtml: html.encode,
        decodeHtml: html.decode
    };
})();