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
const FIND_ANNOTATION = /@[_a-zA-Z][_a-zA-Z0-9]*/; 
const FIND_IDENTIFIER = /[_a-zA-Z][_a-zA-Z0-9]*/; 
const FIND_STRING = /".*?"/; 
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
        tokens: tokenizeLines(lines) 
    };
    code.functions = findFunctionsInCode(code.tokens, lines); 

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

function requestReadability(stats) 
{
    // maxLineLength,avgLineLength,avgParensPerLine,maxParensPerLine,avgParenSpaceBuffersPerLine,avgPeriodsPerLine,maxPeriodsPerLine,avgComparisonsPerLine,maxComparisonsPerLine,avgSpacesPerLine,maxSpacesPerLine,avgTabsPerLine,maxTabsPerLine,avgIdentifiersPerLine,maxIdentifiersPerLine
    let inputs = [
        stats.maxLineLength, 
        stats.avgLineLength, 
        stats.avgParensPerLine, 
        stats.maxParensPerLine, 
        stats.avgParenSpaceBuffersPerLine, 
        stats.avgPeriodsPerLine, 
        stats.maxPeriodsPerLine, 
        stats.avgComparisonsPerLine, 
        stats.maxComparisonsPerLine, 
        stats.avgSpacesPerLine, 
        stats.maxSpacesPerLine, 
        stats.avgTabsPerLine, 
        stats.maxTabsPerLine, 
        stats.avgIdentifiersPerLine, 
        stats.maxIdentifiersPerLine 
    ];

    // TODO send [inputs] to Watson 

    return Math.random(); 
}

function findFunctionsInCode(tokens, lines) 
{
    let functions = {}; 

    let i = 0; 
    let atEnd = () => i >= tokens.length; 
    let peek = () => atEnd() ? {} : tokens[i]; 
    let skipWhitespace = () => { while (peek().type === TOKEN_WHITESPACE) next(); };
    let next = () => atEnd() ? {} : tokens[i++]; 
    let nextIf = (type) => { if (peek().type === type) return next(); }; 

    while (!atEnd()) 
    {
        let token = next(); 
        if (token.type === TOKEN_IDENTIFIER) 
        {
            let name = token.value; 
            // check if it is a function 
            skipWhitespace(); 
            if (nextIf(TOKEN_PAREN_OPEN))
            {
                name += '('; 
                // potential function: need to find: "...) { ... }" 
                skipWhitespace(); 
                let parens = 1; 
                while (!atEnd() && parens !== 0) 
                {
                    let tok = next(); 
                    name += tok.value; 
                    if (tok.type === TOKEN_PAREN_OPEN) parens++; 
                    if (tok.type === TOKEN_PAREN_CLOSE) parens--; 
                }

                if (parens === 0) 
                {
                    // found identifier(...)
                    // now find {...}
                    // TODO support 'throws Exception' 
                    skipWhitespace(); 
                    if (next().type === TOKEN_BRACE_OPEN) 
                    {
                        let braces = 1; 
                        let tok = null; 
                        while (!atEnd() && braces !== 0) 
                        {
                            tok = next(); 
                            if (tok.type === TOKEN_BRACE_OPEN) braces++; 
                            if (tok.type === TOKEN_BRACE_CLOSE) braces--; 
                        }

                        if (braces === 0) 
                        {
                            functions[name] = createFunctionData(name, lines, token.line, tok.line); 
                        }
                    }
                }
            }
        }
    }

    return functions; 
}

function tokenizeLines(lines) 
{
    let out = []; 

    // this mess should be good enough 
    let tokenize = /\t| |~|\+\+|\+|--|-|\*|\/|%|\|\||&&|\^|\||&|\{|\}|\[|\]|>=|>|==|<=|<|!=|=|\.|\,|\(|\)|;|:|@[_a-zA-Z][_a-zA-Z0-9]*|'.*?'|".*?"|[_a-zA-Z][_a-zA-Z0-9]*/g; 

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

                out.push(entry); 
            }
        }
    }

    return out; 
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
    else if (token.match(FIND_STRING)) return TOKEN_STRING; 
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

    for (let i = start; i <= end; i++) 
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

function getSlidingWindowRatings(rawCode){
    let lines = rawCode.split('\n'); 
    let ratings = [];
    let text = [];
    let wndw;
    // console.log('lines: ' + lines.length); 
    for (let i = 0; i < lines.length; i++){
        wndw = "";
        text.push(lines[i]);
        if (text.length >5){
            text.shift();
        }
        for(line in text){
            wndw = wndw + "\n"+text[line];
        }
        let stats = genCodeStatistics(wndw); 
        let readability = requestReadability(stats.all); 
        ratings.push({ readability: readability });
    }
    for (let i = 0; i < 5; i++){
        wndw = "";
        text.shift();
        for(line in text){
            wndw = wndw + "\n"+text[line];
        }
        let stats = genCodeStatistics(wndw); 
        let readability = requestReadability(stats.all); 
        ratings.push({ readability: readability });
    }
    lineratings = [];
    for (let i = 0; i <lines.length; i++){
        lineratings.push(getRatingAverage(ratings.slice(i, i+5)));
    }
    return lineratings;
}

function getRatingAverage(ratings) 
{
    newRatings = {}; 

    for (key in ratings[0]) 
    {
        let value = ratings[0][key]; 
        for (let i = 1; i < ratings.length; i++) 
        {
            value += ratings[i][key]; 
        }
        value /= ratings.length; 
        newRatings[key] = value; 
    }

    return newRatings; 
}