export function toDateString(ts) {

    var ts_ms = ts * 1000;
    return new Date(ts_ms).toUTCString();
}
export function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}