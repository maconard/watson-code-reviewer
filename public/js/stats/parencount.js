statRules.parenCount = function(stats, code) 
{
    let totalParens = 0.0; 
    let count = 0; 
    for (let i in code.lines) 
    {
        let line = code.lines[i]; 
        let parens = (line.match(/\(|\)/g) || []).length; 

        totalParens += parens; 
        count++; 

        stats.lines[i].parenCount = parens; 
    }

    stats.avgParens = totalParens / count; 
}