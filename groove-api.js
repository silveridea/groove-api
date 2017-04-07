var request = require('request');

function GrooveApi(_auth) {
    this.auth = _auth;
    this.apiUrl = "https://api.groovehq.com/v1/";
};

GrooveApi.prototype.getTickets = function (assignee, customer, page, per_page, state, folder, callback) {
    var _auth = this.auth;
    var _apiUrl = this.apiUrl;
    return new Promise(function (resolve, reject) {
        if (!assignee && !customer) {
            var err1 = new Error("Either assignee or customer email must be specified");
            if (callback) {
                return reject(callback(err1));
            }
            return reject(err1);
        }

        var url = buildUrl(_apiUrl, {
            path: 'tickets',
            queryParams: {
                assignee: assignee,
                customer: customer,
                page: page,
                per_page: per_page,
                state: state,
                folder: folder
            }
        });
        get(url, _auth)
            .then(JSON.parse)
            .then(function (data) {
                if (callback)
                    resolve(callback(null, data));
                resolve(data);
            },
            function (err) {
                if (callback)
                    reject(callback(err));
                reject(err);
            });
    });
};

GrooveApi.prototype.getTicket = function (ticket_number, callback) {
    var _auth = this.auth;
    var _apiUrl = this.apiUrl;
    return new Promise(function (resolve, reject) {
        if (!ticket_number) {
            var err1 = new Error("ticket_number must be specified");
            if (callback) {
                return reject(callback(err1));
            }
            return reject(err1);
        }
        var url = buildUrl(_apiUrl, {
            path: 'tickets/' + ticket_number
        });
        get(url, _auth)
            .then(JSON.parse)
            .then(function (data) {
                if (callback)
                    resolve(callback(null, data));
                resolve(data);
            },
            function (err) {
                if (callback)
                    reject(callback(err));
                reject(err);
            });
    });
};

GrooveApi.prototype.getMessages = function (ticket_number, page, per_page, callback) {
    var _auth = this.auth;
    var _apiUrl = this.apiUrl;
    return new Promise(function (resolve, reject) {
        if (!ticket_number) {
            var err1 = new Error("ticket_number must be specified");
            if (callback) {
                return reject(callback(err1));
            }
            return reject(err1);
        }
        var url = buildUrl(_apiUrl, {
            path: 'tickets/' + ticket_number + '/messages',
            queryParams: {
                page: page,
                per_page: per_page
            }
        });
        get(url, _auth)
            .then(JSON.parse)
            .then(function (data) {
                if (callback)
                    resolve(callback(null, data));
                resolve(data);
            },
            function (err) {
                if (callback)
                    reject(callback(err));
                reject(err);
            });
    });
};

GrooveApi.prototype.createTicket = function (body, from, to, assigned_group, assignee, sent_at, note, send_copy_to_customer, state, subject, tags, callback) {
    //TODO:Optional Customer Parameters, name, email
    var _auth = this.auth;
    var _apiUrl = this.apiUrl;
    return new Promise(function (resolve, reject) {
        if (!from) {
            var err1 = new Error("from must be specified");
            if (callback) {
                return reject(callback(err1));
            }
            return reject(err1);
        }
        if (!to) {
            var err1 = new Error("to must be specified");
            if (callback) {
                return reject(callback(err1));
            }
            return reject(err1);
        }
        if (!body) {
            var err1 = new Error("body text cannot be empty");
            if (callback) {
                return reject(callback(err1));
            }
            return reject(err1);
        }

        var url = buildUrl(_apiUrl, {
            path: 'tickets/'
        });

        var postBody = {
            body: body,
            from: from,
            to: to,
            assigned_group: assigned_group,
            assignee: assignee,
            sent_at: sent_at,
            note: note,
            send_copy_to_customer: send_copy_to_customer,
            state: state,
            subject: subject,
            tags: tags
        };

        post(url, _auth, postBody)
            .then(JSON.parse)
            .then(function (data) {
                if (callback)
                    resolve(callback(null, data));
                resolve(data);
            },
            function (err) {
                if (callback)
                    reject(callback(err));
                reject(err);
            });
    });
};

GrooveApi.prototype.createMessage = function (ticket_number, body, author, sent_at, note, send_copy_to_customer, callback) {
    var _auth = this.auth;
    var _apiUrl = this.apiUrl;
    return new Promise(function (resolve, reject) {
        if (!ticket_number) {
            var err1 = new Error("ticket_number must be specified");
            if (callback) {
                return reject(callback(err1));
            }
            return reject(err1);
        }
        if (!body) {
            var err1 = new Error("body text cannot be empty");
            if (callback) {
                return reject(callback(err1));
            }
            return reject(err1);
        }

        var url = buildUrl(_apiUrl, {
            path: 'tickets/' + ticket_number + '/messages'
        });

        var postBody = {
            body: body,
            author: author,
            sent_at: sent_at,
            note: note,
            send_copy_to_customer: send_copy_to_customer
        };

        post(url, _auth, postBody)
            .then(JSON.parse)
            .then(function (data) {
                if (callback)
                    resolve(callback(null, data));
                resolve(data);
            },
            function (err) {
                if (callback)
                    reject(callback(err));
                reject(err);
            });
    });
};

var get = function (uri, auth) {
    return new Promise(function (resolve, reject) {
        request({
            url: uri,
            method: 'GET',
            headers: {
                'Authorization': ('Bearer ' + auth),
                'content-type': 'application/json'
            }
        },
            function (error, response, body) {
                if (error) {
                    reject(error);
                } else if (response.statusCode == 401) {
                    reject(new Error("Unauthorized"));
                } else {
                    resolve(body);
                }
            }
        )
    });
};

var post = function (uri, auth, body) {
    var options = {
        method: 'POST',
        url: uri,
        headers: {
            'Authorization': ('Bearer ' + auth),
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    return new Promise(function (resolve, reject) {
        request(options,
            function (error, response, body) {
                if (error) {
                    reject(error);
                } else if (response.statusCode == 401) {
                    reject(new Error("Unauthorized"));
                } else {
                    resolve(body);
                }
            }
        )
    });
};

var buildUrl = function (url, options) {
    var queryString = [];
    var key;
    var builtUrl;

    if (url === null) {
        builtUrl = '';
    } else if (typeof (url) === 'object') {
        builtUrl = '';
        options = url;
    } else {
        builtUrl = url;
    }

    if (options) {
        if (options.path) {
            if (!builtUrl.endsWith('/'))
                builtUrl += '/';
            builtUrl += options.path;
        }

        if (options.queryParams) {
            for (key in options.queryParams) {
                if (options.queryParams.hasOwnProperty(key) &&
                    typeof (options.queryParams[key]) !== 'undefined' &&
                    options.queryParams[key] !== null &&
                    options.queryParams[key] !== "") {
                    queryString.push(key + '=' + options.queryParams[key]);
                }
            }
            builtUrl += '?' + queryString.join('&');
        }

        if (options.hash) {
            builtUrl += '#' + options.hash;
        }
    }
    return builtUrl;
};

module.exports = GrooveApi;