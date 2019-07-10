var statRules = {}; 

function genCodeStatistics(rawCode) 
{
    let lines = rawCode.split('\n'); 

    let code = 
    {
        all: { lines: lines }, 
        functions: findFunctionsInCode(lines)  
    };

    let stats = 
    {
        all: { lines: [] }, 
        functions: {}  
    };

    for (let i in code.all.lines) 
    {
        stats.all.lines.push({}); 
    }

    for (let fName in code.functions) 
    {
        stats.functions[fName] = { lines: [] };  

        for (let i in code.functions[fName].lines) {
            stats.functions[fName].lines.push({}); 
        }
    }

    for (ruleName in statRules)  
    {
        statRules[ruleName](stats.all, code.all); 

        for (let fName in code.functions) 
        {
            statRules[ruleName](stats.functions[fName], code.functions[fName]); 
        }
    }

    return stats; 
}

function findFunctionsInCode(lines) 
{
    let functions = {}; 
    let functionPrefixFinder = /\s[a-zA-z0-9]+\s*\(/; 
    let functionSuffixFinder = /\)\s*{/; 

    let curFunction = null; 
    let startLine = -1; 

    for (let i in lines) 
    {
        let prefixIndex = functionPrefixFinder.exec(lines[i]); 
        let suffixIndex = functionSuffixFinder.exec(lines[i]); 

        if (prefixIndex != null && suffixIndex != null) 
        {
            if (prefixIndex.index < suffixIndex.index) 
            {
                // found function (this is not great but will work for simple code)
                let fName = prefixIndex[0];
                fName = fName.substr(1, fName.length - 2);  
                if (fName.match('if|for|while|try|catch')) continue; 

                if (curFunction != null) 
                {
                    functions[curFunction] = createFunctionData(curFunction, lines, startLine, i); 
                }
                curFunction = fName; 
                startLine = i; 
            }
        }
    }

    if (curFunction != null) 
    {
        functions[curFunction] = createFunctionData(curFunction, lines, startLine, lines.length); 
    }

    return functions; 
}

function createFunctionData(name, lines, start, end) 
{
    func = { lines: [] }; 

    let notJustSpaces = /[^\s]/; 

    let foundLine = false; 
    let tmp = []; 

    start = parseInt(start); 
    end = parseInt(end); 

    for (let i = start; i < end; i++) 
    {
        if (lines[i].match(notJustSpaces)) 
        {
            for (let j in tmp) 
            {
                func.lines.push(tmp[j]); 
            }
            tmp = []; 
            func.lines.push(lines[i]); 
            foundLine = true; 
        }
        else if (foundLine) 
        {
            tmp.push(lines[i]); 
        }
    }

    return func; 
}
