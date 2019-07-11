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

        let stats = genCodeStatistics(code); 
        let all = stats.all; 

        // maxLineLength,avgLineLength,avgParensPerLine,maxParensPerLine,avgParenSpaceBuffersPerLine,avgPeriodsPerLine,maxPeriodsPerLine,avgComparisonsPerLine,maxComparisonsPerLine,avgSpacesPerLine,maxSpacesPerLine,avgTabsPerLine,maxTabsPerLine,avgIdentifiersPerLine,maxIdentifiersPerLine
        let outputs = [
            all.maxLineLength, 
            all.avgLineLength, 
            all.avgParensPerLine, 
            all.maxParensPerLine, 
            all.avgParenSpaceBuffersPerLine, 
            all.avgPeriodsPerLine, 
            all.maxPeriodsPerLine, 
            all.avgComparisonsPerLine, 
            all.maxComparisonsPerLine, 
            all.avgSpacesPerLine, 
            all.maxSpacesPerLine, 
            all.avgTabsPerLine, 
            all.maxTabsPerLine, 
            all.avgIdentifiersPerLine, 
            all.maxIdentifiersPerLine 
        ]; 
        console.log(stats); 
        console.log(outputs.toString()); 

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
