/**
 * Taken from:
 * https://gist.github.com/Hyvi/1350603/b65c127802dbc6949c181044416adbb4b7aed534
 *

Unicode Strings

In most browsers, calling window.btoa on a Unicode string will cause a Character Out Of Range exception.

To avoid this, consider this pattern, noted by Johan Sundström(http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html):

*/

function ubtoa( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
}

function uatob( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}
