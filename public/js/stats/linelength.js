statRules.lineLength = function(stats, code) 
{
    let totalLines = 0.0; 
    let maxLineLen = 0; 
    let count = 0; 
    for (let i in code.lines) 
    {
        let len = code.lines[i].length; 
        totalLines += len; 
        count++; 
        stats.lines[i].lineLength = len; 

        if (len > maxLineLen) maxLineLen = len; 
    }

    stats.numLines = count; 
    stats.maxLineLength = maxLineLen; 
    stats.avgLineLength = totalLines / count; 
}