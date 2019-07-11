//import { Button } from 'carbon-components-react';

<<<<<<< HEAD
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render((
    <App/>
), document.getElementById('root')

);
=======
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

        console.log(genCodeStatistics(code)); 

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
>>>>>>> 23bbe47968860591ae3903b5a0da6fc7351e5340
