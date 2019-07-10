statRules.lineLength = function(stats, code) 
{
    let totalLines = 0.0; 
    let count = 0; 
    for (let i in code.lines) 
    {
        let len = code.lines[i].length; 
        totalLines += len; 
        count++; 
        stats.lines[i].length = len; 
    }

    stats.avgLength = totalLines / count; 
}