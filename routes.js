Router.map(function() {
    this.route('home', {
        path: '/'
    });
    this.route('books', {
        path: '/books'
    });
    this.route('api', {
        where: 'server',
        path: '/api/book/add',
        action: function() {
            var book = {};
            for(var p in this.params) {
                if(p === 'hash') continue;
                book[p] = this.params[p];
            }
            Books.insert(book);
            this.response.writeHead(200, {'Content-Type': 'application/json'});
            this.response.end(JSON.stringify({
                'book': book
            }));
        }
    });
});