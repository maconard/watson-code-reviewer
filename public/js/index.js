//import { Button } from 'carbon-components-react';

$(document).ready(function() {
    let submitCodeBtn = $('#watson-submit-button');
    let resetCodeBtn = $('#watson-reset-button');
    let codeBox = $('#codebox');
    let formatBox = $('#formatted-code');

    submitCodeBtn.on('click', function(e) {
        var code = codeBox.val();
        //console.log("Submitted code:");
        //console.log(code);

        codeBox.hide();
        formatBox.html(code);
        formatBox.parent().parent().show();
        resetCodeBtn.attr('disabled',false);
    });

    resetCodeBtn.on('click', function(e) {
        codeBox.val("");
        formatBox.html("");
        resetCodeBtn.attr('disabled',true);
        formatBox.parent().parent().hide();
        codeBox.show();
    });
});
