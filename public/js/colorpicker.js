var readabilityColors = []; 

generateReadabilityColors(0xFF0000, 0xF7E77B, 0x7FFF7F); 

// as a number between [0,100]
function getReadabilityColor(readability) 
{
    if (readability < 0) readability = 0; 
    if (readability > 100) readability = 100; 
    readability = Math.round(readability); 

    return readabilityColors[readability]; 
}

function generateReadabilityColors(red, yellow, green) 
{
    for (let i = 0; i < 50; i++) 
    {
        readabilityColors.push(lerpColor(red, yellow, i / 50.0)); 
    }
    for (let i = 0; i <= 50; i++) 
    {
        readabilityColors.push(lerpColor(yellow, green, i / 50.0)); 
    }
}

function lerpColor(a, b, x) 
{
    // return lerp(a, b, x); 
    let red = Math.floor(lerp(
        (a >>> 16) & 0xFF, 
        (b >>> 16) & 0xFF, 
        x
    )); 
    let green = Math.floor(lerp(
        (a >>> 8) & 0xFF, 
        (b >>> 8) & 0xFF, 
        x
    )); 
    let blue = Math.floor(lerp(
        a & 0xFF, 
        b & 0xFF, 
        x
    )); 
    return red << 16 | green << 8 | blue; 
}

function lerp(a, b, x) 
{
    return a * (1 - x) + b * x; 
}