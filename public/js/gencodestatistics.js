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

function sendPayload(payload) {
    var dat = {payload: payload};
    // console.log(dat);

    let out = 0; 
    //$("#loading-ajax").show();
    
    $.ajax({
        type: 'POST', 
        url: '/analyze', 
        data: dat, 
        async: false, 
        success: function(score, status) {
            // console.log("Score: " + score + "\nStatus: " + status);
            out = score; 
            //$("#loading-ajax").hide();
        },
        error: function(err) {
            //$("#loading-ajax").hide();
        }
    }); 

    return parseFloat(out); 
}

function sendBatchPayload(payload) {
    var dat = {payload: payload};
    // console.log(dat);

    let out = 0; 
 
    $.ajax({
        type: 'POST', 
        url: '/analyze-batch', 
        data: dat, 
        async: false, 
        success: function(scores, status) {
            console.log(scores); 
            scores = JSON.parse('[' + scores + ']'); 
            console.log("Scores: " + scores.toString() + "\nStatus: " + status);
            console.log(typeof(scores)); 
            for (let i in scores) 
            {
                scores[i] = parseFloat(scores[i]); 
                if (isNaN(scores[i])) scores[i] = 0; 
            }
            out = scores; 
        }
    }); 

    return out; 
}

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

function getStatList(stats) 
{
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
    return inputs; 
}

function requestReadability(stats) 
{
    // maxLineLength,avgLineLength,avgParensPerLine,maxParensPerLine,avgParenSpaceBuffersPerLine,avgPeriodsPerLine,maxPeriodsPerLine,avgComparisonsPerLine,maxComparisonsPerLine,avgSpacesPerLine,maxSpacesPerLine,avgTabsPerLine,maxTabsPerLine,avgIdentifiersPerLine,maxIdentifiersPerLine
    
    let inputs = getStatList(stats); 
    // console.log(inputs);

    let score = sendPayload(inputs); 
    console.log('Payload score: ' + score); 
    return score; 
}

function requestBatchReadability(statsBatch) 
{
    let batch = []; 

    for (let i in statsBatch) 
    {
        batch.push(getStatList(statsBatch[i])); 
        // batch.push(Math.random() * 100); 
    }

    console.log(batch); 

    let scores = sendBatchPayload(batch); 
    console.log('Payload scores: ' + scores); 
    return scores; 
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
    let text = [];
    let wndw;

    let readList = []; 
    let lists = []; 

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
        readList.push(stats.all); 
        if (readList.length > 50) 
        {
            lists.push(readList); 
            readList = []; 
        }
    }
    for (let i = 0; i < 5; i++){
        wndw = "";
        text.shift();
        for(line in text){
            wndw = wndw + "\n"+text[line];
        }
        let stats = genCodeStatistics(wndw); 
        readList.push(stats.all); 
    }
    lists.push(readList); 

    console.log('numRequests: ' + lists.length); 
    let ratingsList = []; 
    for (let i = 0; i < lists.length; i++) 
    {
        ratingsList.push(requestBatchReadability(lists[i])); 
    }
    let ratings = []; 
    for (let i = 0; i < ratingsList.length; i++) 
    {
        ratings = ratings.concat(ratingsList[i]); 
    }
    
    console.log('Ratings: ' + ratings); 
    lineratings = [];
    for (let i = 0; i <lines.length; i++){
        console.log('line ratings ' + i); 
        lineratings.push(getRatingAverage(ratings.slice(i, i+5)));
    }
    return lineratings;
}

function getRatingAverage(ratings) 
{
    let sum = 0.0; 

    console.log(ratings); 

    for (value of ratings) 
    {
        console.log(typeof(value)); 
        sum += value; 
    }

    console.log('sum: ' + sum + ' avg: ' + sum / ratings.length); 

    return sum / ratings.length; 
}
