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

    let total = 
    {
        add: (a, b) => a + b, 
        avg: (sum, count) => sum 
    };

    let parenCheck = /\(|\)/g; 
    let parenSpaceCheck = /\(\s|\s\)/g; 
    let periodCheck = /\./g; 
    let compareCheck = />|>=|==|<|<=|!=|compareTo|equals/g; 
    let spacesCheck = / /g; 
    let tabsCheck = /\t/g; 
    let tokenCheck = /[_a-zA-Z][_a-zA-Z0-9]*/g; // TODO no keywords? no strings? 

    getSimpleCount(stats, code, 'numParens', parenCheck); 
    getSimpleCountTotal(stats, code, 'avgParensPerLine', avg, parenCheck); 
    getSimpleCountTotal(stats, code, 'maxParensPerLine', max, parenCheck); 

    getSimpleCount(stats, code, 'numParenSpaceBuffers', parenSpaceCheck); 
    getSimpleCountTotal(stats, code, 'avgParenSpaceBuffersPerLine', avg, parenSpaceCheck); 
    getSimpleCountTotal(stats, code, 'totalParenSpaceBuffers', total, parenSpaceCheck); 

    getSimpleCount(stats, code, 'numPeriods', periodCheck); 
    getSimpleCountTotal(stats, code, 'avgPeriodsPerLine', avg, periodCheck); 
    getSimpleCountTotal(stats, code, 'maxPeriodsPerLine', max, periodCheck); 

    getSimpleCount(stats, code, 'numComparisons', compareCheck); 
    getSimpleCountTotal(stats, code, 'avgComparisonsPerLine', avg, compareCheck); 
    getSimpleCountTotal(stats, code, 'maxComparisonsPerLine', max, compareCheck); 

    getSimpleCount(stats, code, 'numSpaces', spacesCheck); 
    getSimpleCountTotal(stats, code, 'avgSpacesPerLine', avg, spacesCheck); 
    getSimpleCountTotal(stats, code, 'maxSpacesPerLine', max, spacesCheck); 

    getSimpleCount(stats, code, 'numTabs', tabsCheck); 
    getSimpleCountTotal(stats, code, 'avgTabsPerLine', avg, tabsCheck); 
    getSimpleCountTotal(stats, code, 'maxTabsPerLine', max, tabsCheck); 

    getSimpleCount(stats, code, 'numIdentifiers', tokenCheck); 
    getSimpleCountTotal(stats, code, 'avgIdentifiersPerLine', avg, tokenCheck); 
    getSimpleCountTotal(stats, code, 'maxIdentifiersPerLine', max, tokenCheck); 
}

function getSimpleCount(stats, code, lineName, totalName, totalFunc, regex) 
{
    for (let i in code.lines) 
    {
        let line = code.lines[i]; 
        let localCount = (line.match(regex) || []).length; 

        if (lineName != null) stats.lines[i][lineName] = localCount; 
    }
}

function getSimpleCountTotal(stats, code, totalName, totalFunc, regex) 
{
    let total = 0.0; 
    for (let i in code.lines) 
    {
        let line = code.lines[i]; 
        let localCount = (line.match(regex) || []).length; 

        total = totalFunc.add(total, localCount); 
    }

    stats[totalName] = totalFunc.avg(total, code.lines.length); 
}