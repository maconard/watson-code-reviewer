statRules.simpleCount = function(stats, code) 
{
    let avg = 
    {
        add: (a, b) => a + b, 
        avg: (sum, count) => sum / count
    };

    let max = 
    {
        add: Math.max, 
        avg: (sum, count) => sum 
    };

    getSimpleCount(stats, code, 'numParens', 'avgParensPerLine', avg, /\(|\)/g); 
    getSimpleCount(stats, code, 'numPeriods', 'avgPeriodsPerLine', avg, /\./g); 
    getSimpleCount(stats, code, null, 'maxParensPerLine', max, /\(|\)/g); 
    getSimpleCount(stats, code, null, 'maxPeriodsPerLine', max, /\./g); 
}

function getSimpleCount(stats, code, lineName, totalName, totalFunc, regex) 
{
    let total = 0.0; 
    let count = 0; 
    for (let i in code.lines) 
    {
        let line = code.lines[i]; 
        let localCount = (line.match(regex) || []).length; 

        total = totalFunc.add(total, localCount); 

        if (lineName != null) stats.lines[i][lineName] = localCount; 
    }

    if (totalName != null) stats[totalName] = totalFunc.avg(total, code.lines.length); 
}