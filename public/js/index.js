//import { Button } from 'carbon-components-react';

$(document).ready(function() {
    let submitCodeBtn = $('#watson-submit-button');
    let resetCodeBtn = $('#watson-reset-button');
    let codeBox = $('#codebox');
    let formatBox = $('#formatted-code');

    codeBox.on('keyup', function(e) {
        var code = codeBox.val();
        if(code.length == 0) {
            submitCodeBtn.attr('disabled',true);
        } else {
            submitCodeBtn.attr('disabled',false);
        }
    });

    submitCodeBtn.on('click', function(e) {
        var code = codeBox.val();
        //console.log("Submitted code:");
        //console.log(code);

        codeBox.hide();
        formatBox.html("<pre>" + code + "</pre>");
        formatBox.parent().show();
        resetCodeBtn.attr('disabled',false);
        submitCodeBtn.attr('disabled',false);
    });

    resetCodeBtn.on('click', function(e) {
        codeBox.val("");
        formatBox.html("");
        resetCodeBtn.attr('disabled',true);
        formatBox.parent().hide();
        codeBox.show();
    });
});
