var helpers = (function(window, document, undefined) {
    'use strict';

    return {

        // form filename for output
        getFilename: function(fileLocation) {

            // Get filename for log
            var today = new Date(),
            yyyy = today.getFullYear(),
            mm = today.getMonth() + 1,
            d = today.getDate();

            if (mm < 10) {mm = '0' + mm;}
            if (d < 10) {d = '0' + d;}

            var filename = fileLocation;

            filename += yyyy + '-' + mm + '-' + d;

            return filename;
        },


        // show status colors in terminal output
        statusColor: function(status) {
            var statusStyle;

            switch(status) {
                case 200:
                    statusStyle = {fg: 'green', bold: true};
                break;
                case 404:
                    statusStyle = {fg: 'red', bold: true};
                break;
                default:
                    statusStyle = {fg: 'orange', bold: true};
                break;
            }

            return statusStyle;
        },


        // take any comma or space separation values and return array
        prepareArr: function(arr) {
            arr = arr.replace(/ /g, '');
            arr = arr.split(',');
            return arr;
        },


        // Turn a (possibly) relative URI into a full RFC 3986-compliant URI
        // With minor modifications, courtesy: https://gist.github.com/Yaffle/1088850
        absoluteUri: function (base, rel_path) {

            // ref:  http://phpjs.org/functions/parse_url/
            function parse_url(str) {
                var query, key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
                    'relative', 'path', 'directory', 'file', 'query', 'fragment'
                ],
                ini = {},
                mode = 'php',
                parser = {
                    php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
                };

                var m = parser[mode].exec(str),
                uri = {},
                i = 14;
                while (i--) {
                    if (m[i]) {
                        uri[key[i]] = m[i];
                    }
                }
                delete uri.source;
                return uri;
            };

            // console.log("1base::" + base);
            base = base.replace('/\/[^\/]+$/', '/');
            // console.log("2base::" + base);
            parse = parse_url(base);
            if(rel_path.match(/^https?\:\/\//) !== null){
                return rel_path;
            }
            else if(rel_path.match(/^\/.+/) !== null){
                ret = parse['scheme'] + '://' + parse['host'] + '/' + rel_path;
                return ret;
            }
            var tmp = [], a = [], b = [];
            if(parse['path'] !== undefined){
                tmp = parse['path'].split('/');
                tmp_len = tmp.length;
                for(var i=0; i<tmp_len; i++){
                    if(tmp[i] !== ""){
                        a.push(tmp[i]);
                    }
                }
            }
            b = rel_path.split('/');
            b_len = b.length;
            for(var j=0; j<b_len; j++){
                if(b[j] === ''){
                    continue;
                }else if(b[j] === '.'){
                }
                else if(b[j] === '..'){
                    a.pop();
                }
                else{
                    a.push(b[j]);
                }
            }
            path = a.join('/');
            ret = parse['scheme'] + '://' + parse['host'] + '/' + path;
            return ret;

        }
    };

})(this, this.document);


module.exports = helpers;
