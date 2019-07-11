$(function() {
    var includes = $('[data-include]');
    jQuery.each(includes, function(){
        var file = 'templates/' + $(this).data('include') + '.html';
        $(this).load(file);
    });
});

function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;', 
      ' ': '&nbsp;', 
      '\t': '&nbsp;&nbsp;&nbsp;&nbsp;'
    };
  
    return text.replace(/[&<>"' \t]/g, function(m) { return map[m]; });
}

