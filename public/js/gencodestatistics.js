const TOKEN_UNKNOWN = 'unknown'; 
const TOKEN_WHITESPACE = 'whitespace'; 
const TOKEN_COMPARISON = 'comparison'; 
const TOKEN_KEYWORD = 'keyword'; 
const TOKEN_IDENTIFIER = 'identifier'; 
const TOKEN_ANNOTATION = 'annotation'; 
const TOKEN_NUMBER = 'number'; 
const TOKEN_STRING = 'string'; 
const TOKEN_PAREN_OPEN = 'paren_open'; 
const TOKEN_PAREN_CLOSE = 'paren_close'; 
const TOKEN_BRACE_OPEN = 'brace_open'; 
const TOKEN_BRACE_CLOSE = 'brace_close'; 

const FIND_WHITESPACE = /\t| /; 
const FIND_ANNOTATION = /@[a-zA-Z][a-zA-Z0-9]*/; 
const FIND_IDENTIFIER = /[a-zA-Z][a-zA-Z0-9]*/; 
const FIND_MATH = /\+\+|\+|--|-|\*|\/|%/; 
const FIND_MISC_LOGIC = /~|\+\+|--|\|\||&&|\^|\||&/; 

const KEYWORDS = 
{
    if: true, 
    else: true, 
    while: true, 
    do: true, 
    class: true, 
    new: true, 
    extends: true, 
    public: true, 
    protected: true, 
    private: true, 
    void: true, 
    return: true, 
    continue: true, 
    break: true, 
    for: true  
};

var statRules = {}; 

function genCodeStatistics(rawCode) 
{
    let lines = rawCode.split('\n'); 

    let code = 
    {
        all: { lines: lines }, 
        functions: findFunctionsInCode(lines), 
        tokens: tokenizeLines(lines) 
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

function tokenizeLines(lines) 
{
    console.log('tokenize'); 
    let tokens = []; 

    // this mess should be good enough 
    let tokenize = /\t| |~|\+\+|\+|--|-|\*|\/|%|\|\||&&|\^|\||&|\{|\}|\[|\]|>=|>|==|<=|<|!=|=|\.|\,|\(|\)|;|:|@[a-zA-Z][a-zA-Z0-9]*|'.*?'|".*?"|[a-zA-Z][a-zA-Z0-9]*/g; 

    for (let i in lines) 
    {
        let line = lines[i]; 
        let tokens = line.match(tokenize); 

        if (tokens != null) 
        {
            for (j in tokens) 
            {
                let token = tokens[j]; 
                let entry = {
                    line: parseInt(i), 
                    value: token, 
                    type: getTokenType(token) 
                }; 

                console.log('token: "' + JSON.stringify(entry) + '"'); 
            }
        }
    }

    return tokens; 
}

// TODO add as needed 
function getTokenType(token) 
{
    if (token == ' ' || token == '\t') return TOKEN_WHITESPACE; 

    else if (token == '(') return TOKEN_PAREN_OPEN; 
    else if (token == ')') return TOKEN_PAREN_CLOSE; 
    else if (token == '{') return TOKEN_BRACE_OPEN; 
    else if (token == '}') return TOKEN_BRACE_CLOSE; 

    else if (token.match(FIND_ANNOTATION)) return TOKEN_ANNOTATION; 
    else if (token.match(FIND_IDENTIFIER)) 
    {
        if (KEYWORDS[token]) return TOKEN_KEYWORD; 
        else return TOKEN_IDENTIFIER; 
    }

    else return TOKEN_UNKNOWN; 
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
