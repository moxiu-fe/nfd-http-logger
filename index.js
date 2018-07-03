var httpLogger = function(regExp) {
    if (regExp && regExp instanceof RegExp) {
        return function(req, res, next) {
            if (regExp.test(req.path)) {
                req.recordHttpLog = false; // 标志这个请求日志还没有保存
                res._sendData_ = res.send;
                res.send = function(data) {
                    if (!req.recordHttpLog) {
                        req.recordHttpLog = true;
                        res.emit('recordHttpLog', data);
                    }
                    res._sendData_(data);
                }
                res.once('recordHttpLog', function(data) {
                    var combined_tokens = assemble_tokens(req, res, data);
                    var line = format(combined_tokens);
                    console.log(line);
                });
            }
            next();
        }
    } else {
        return function(req, res, next) {
            req.recordHttpLog = false; // 标志这个请求日志还没有保存
            res._sendData_ = res.send;
            res.send = function(data) {
                if (!req.recordHttpLog) {
                    req.recordHttpLog = true;
                    res.emit('recordHttpLog', data);
                }
                res._sendData_(data);
            }
            res.once('recordHttpLog', function(data) {
                var combined_tokens = assemble_tokens(req, res, data);
                var line = format(combined_tokens);
                console.log(line);
            });
            next();
        }
    }
}

/**
 * Adds custom {token, content} objects to defaults,
 * overwriting the defaults if any tokens clash
 *
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @return {Array}
 * Tokens:
 *   - `remoteAddress, method, url, status, protocol, httpVersion`
 *   - `requestHeader`
 *   - `responseHeader`
 *   - `req.query` (if have)
 *   - `req.body` (if have)
 */
function assemble_tokens(req, res, data) {
    let resBody = typeof data === 'object' ? JSON.stringify(data) : data;
    resBody.length > 10000 ? resBody = resBody.substring(0, 10000) + '......' : resBody = resBody; //只记录前10000个长度
    let tokens = {
        general: getGeneralStr(req, res),
        resHeaders: objectToStr(res._headers, '\n     Response Headers'),
        resBody: '\n     Response Body\n       ' + resBody,
        reqHeaders: objectToStr(req.headers, '\n     Request Headers')
    };

    if (req.query && JSON.stringify(req.query) !== "{}") {
        tokens.query = objectToStr(req.query, '\n     Query String Parameter')
    }

    if (req.body && JSON.stringify(req.body) !== "{}") {
        var contenType = req.headers['content-type'];

        if (contenType === 'application/x-www-form-urlencoded') {
            tokens.body = objectToStr(req.body, '\n     Form Data')
        } else if (contenType === 'application/json') {
            tokens.body = '\n     Request Payload\n       ' + JSON.stringify(req.body || {})
        } else if (/text/i.test(contenType)) {
            tokens.body = '\n      Request Payload' + '       ' + req.body;
        }
    }

    return tokens;
}

function getGeneralStr(req, res) {
    var general = '';
    var method = req.method,
        url = req.originalUrl || req.url,
        status = res.statusCode,
        remoteAddress = req.headers['x-forwarded-for'] ||
        req.ip ||
        req._remoteAddress ||
        (req.socket &&
            (req.socket.remoteAddress ||
                (req.socket.socket && req.socket.socket.remoteAddress)
            )
        ),
        protocol = req.protocol,
        httpVersion = 'HTTP/' + req.httpVersion;

    return general = [remoteAddress, method, url, status, protocol, httpVersion].join(' ');
}

function objectToStr(obj, title) {
    var arr = Object.keys(obj),
        str = title;
    arr.forEach(function(item, index) {
        str += '\n       ' + item + ':' + obj[item];
    })

    return str;
}

function format(tokens) {
    var arr = Object.keys(tokens),
        str = '';

    arr.forEach(function(item, index) {
        str += tokens[item]
    })

    return str;
}

module.exports = httpLogger;