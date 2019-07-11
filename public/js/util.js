$(function() {
    var includes = $('[data-include]');
    jQuery.each(includes, function(){
        var file = 'templates/' + $(this).data('include') + '.html';
        $(this).load(file);
    });
});
