var request = require('request');
var buildUrl = require('build-url');

var get = function (uri, auth, callback) {
    callback = callback || function () { };
    return new Promise(function (resolve, reject) {
        request({
            url: uri,
            method: 'GET',
            headers: {
                'Authorization': ('Bearer ' + auth)
            }
        },
           function (error, response, body) {
            if (error) {
                reject(error);
                return callback(err);
            } else if (response.statusCode == 401) {
                reject("Unauthorized");
                return callback("Unauthorized");
            } else {
                resolve(body);
                return callback(null, body);
            }
        }
        )
    });
};

var post = function (uri, auth, body, callback) {
    callback = callback || function () { };
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
                return callback(err);
            } else if (response.statusCode == 401) {
                reject("Unauthorized");
                return callback("Unauthorized");
            } else {
                resolve(body);
                return callback(null, body);
            }
        }
        )
    });
};

function GrooveApi(_auth){
    this.auth = _auth;
    this.apiUrl = "https://api.groovehq.com/v1/";
};

GrooveApi.prototype.getTickets = function (assignee, customer, page, per_page, state, folder, callback) {
    if (!assignee && !customer)
        return new Promise.reject("Either assignee or customer email must be specified"); 
    var url = buildUrl(this.apiUrl, {
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
    return get(url, this.auth, callback).then(JSON.parse);
};

GrooveApi.prototype.getTicket = function (ticket_number, callback) {
    if (!ticket_number)
        return new Promise.reject("ticket_number must be specified");
    var url = buildUrl(this.apiUrl, {
        path: 'tickets/' + ticket_number
    });
    return get(url, this.auth, callback).then(JSON.parse);
};

GrooveApi.prototype.getMessages = function (ticket_number, page, per_page, callback) {
    if (!ticket_number)
        return new Promise.reject("ticket_number must be specified");
    var url = buildUrl(this.apiUrl, {
        path: 'tickets/' + ticket_number + '/messages',
        queryParams: {
            assignee: assignee,
            customer: customer,
            page: page,
            per_page: per_page
        }
    });
    return get(url, this.auth, callback).then(JSON.parse);
};

GrooveApi.prototype.createTicket = function (body, from, to, assigned_group, assignee, sent_at, note, send_copy_to_customer, state, subject, tags, callback) {
    //TODO:Optional Customer Parameters, name, email
    if (!from)
        return new Promise.reject("from must be specified");
    if (!to)
        return new Promise.reject("to must be specified");
    if (!body)
        return new Promise.reject("body text cannot be empty");
    var url = buildUrl(this.apiUrl, {
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
    return post(url, _auth, postBody, callback).then(JSON.parse);
};

GrooveApi.prototype.createMessage = function (ticket_number, body, author, sent_at, note, send_copy_to_customer, callback) {
    if (!ticket_number)
        return new Promise.reject("ticket_number must be specified");
    if (!body)
        return new Promise.reject("body text cannot be empty");
    var url = buildUrl(this.apiUrl, {
        path: 'tickets/' + ticket_number + '/messages'
    });
    var postBody = {
            body: body,
            author: author,
            sent_at: sent_at,
            note: note,
            send_copy_to_customer: send_copy_to_customer
        };
    return post(url, _auth, postBody, callback).then(JSON.parse);
};

module.exports = GrooveApi;