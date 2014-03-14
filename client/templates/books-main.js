Template.books.books = function() {
    return Books.find();
};
Template.books.events({
    'click .book_delete': function(event) {
        Books.remove(event.currentTarget.id);
        return false;
    }
});