Router.map(function() {
    this.route('home', {
        path: '/'
    });
    this.route('books', {
        path: '/books'
    });
    this.route('api-book', {
        where: 'server',
        path: '/api/book/:_id?',
        action: function() {
            var res = this.response,
                body = this.request.body,
                method = this.request.method;

            function respond(code, data) {
                res.writeHead(code, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(data));
            }
            if (method != 'PUT' && !this.params._id) {
                return respond(400, 'ID is missing');
            }
            switch (method) {
                case 'PUT':
                    //create
                    //curl -X PUT --noproxy * -v -H "Content-Type: application/json" -d "{\"title\":\"Anna Karenina\"}" http://localhost:3010/api/book
                    respond(200, {
                        _id: Books.insert(body)
                    });
                    break;
                case 'GET':
                    //read
                    //curl -X GET --noproxy * -v http://localhost:3010/api/book/tj4jZh5euAftasp3y
                    var collection = Books.find(this.params._id);
                    if (collection.count() > 0) {
                        respond(200, collection.fetch()[0]);
                    } else {
                        respond(404, 'Object with ID ' + this.params._id + ' not found');
                    }
                    break;
                case 'POST':
                    //update
                    //curl -X POST --noproxy * -H "Content-Type: application/json" -d "{\"title\":\"Anna Karenina\"}" -v http://localhost:3010/api/book/tj4jZh5euAftasp3y
                    var count = Books.update(this.params._id, body);
                    if (count > 0) {
                        respond(200, Books.find(this.params._id).fetch()[0]);
                    } else {
                        respond(404, 'Object with ID ' + this.params._id + ' not found');
                    }
                    break;
                case 'DELETE':
                    //delete    
                    //curl -X DELETE --noproxy * -v http://localhost:3010/api/book/tj4jZh5euAftasp3y 
                    var collection = Books.find(this.params._id);
                    if (collection.count() <= 0) {
                        respond(404, 'Object with ID ' + this.params._id + ' not found');
                    } else {
                        var doc = collection.fetch()[0];
                        Books.remove(this.params._id);
                        respond(200, doc);
                    }
                    break;
                default:
                    respond(400, 'Bad request method, only PUT, GET, POST and DELETE allowed');
                    break;
            }
        }
    });
    this.route('api-books', {
        where: 'server',
        path: '/api/books',
        action: function() {
            var res = this.response,
                method = this.request.method;

            function respond(code, data) {
                res.writeHead(code, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify(data));
            }
            if (method != 'GET') {
                return respond(400, 'Only GET request is allowed');
            }
            //curl -X GET --noproxy * -v http://localhost:3010/api/books?title=Anna%20Karenina
            //this.params is an Array instance with query properties - need to extract them to pure Object
            var query = {};
            for (var p in this.params) {
                query[p] = this.params[p];
            }
            var collection = Books.find(query);
            if (collection.count() > 0) {
                respond(200, collection.fetch());
            } else {
                respond(404, 'No objects found');
            }
        }
    });
});