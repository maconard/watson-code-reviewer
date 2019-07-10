statRules.periodCount = function(stats, code) 
{
    let totalPeriods = 0.0; 
    let count = 0; 
    for (let i in code.lines) 
    {
        let line = code.lines[i]; 
        let periods = (line.match(/\./g) || []).length; 

        totalPeriods += periods; 
        count++; 

        stats.lines[i].periodCount = periods; 
    }

    stats.avgPeriods = totalPeriods / count; 
}