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

        let readabilities = getSlidingWindowRatings(code);//genCodeStatistics(code); 
        let stats = genCodeStatistics(code); 
        let totalReadability = requestReadability(stats.all); 
        // console.log(totalReadability); 

        let lines = code.split('\n'); 

        // console.log(readabilities); 

        codeBox.hide();

        formatBox.empty(); 

        let color = getReadabilityColor(totalReadability);
        formatBox.append('<code style="background-color:#' + color.toString(16) + ';font-size:24pt;"> Readability Score: ' + totalReadability + '%</code><br>'); 

        let sum = 0.0; 
        for (let i in lines) 
        {
            sum += readabilities[i]; 
        }
        sum /= readabilities.length; 
        console.log('avg readability ' + sum); 

        for (let i in lines) 
        {
            i = parseInt(i); 
            lineNum = ((i+1) + '').padStart(4, ' ').replace(/ /g, '&nbsp;'); 
            let line = lines[i]; 
            let color = getReadabilityColor(readabilities[i]); 
            formatBox.append('<code style="overflow-wrap: break-word;background-color:#' + color.toString(16) + ';font-family:"Courier New", Courier, monospace;">' + lineNum + '</code>'); 
            formatBox.append('<code style="overflow-wrap: break-word;font-family:"Courier New", Courier, monospace;">&nbsp;' + escapeHtml(line) + '</code><br>'); 
        }

        // formatBox.html("<pre>" + code + "</pre>");
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
