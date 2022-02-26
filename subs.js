const fs = require('fs');

fs.readFile('./assets/Naomi-S01E01.srt', 'utf-8',(err, data)=>{
    if(err){
        console.log(err);
        return;
    }
    let subsLinesArr = data.split('\r\n');
    let counter = 1;
    // if(subsLinesArr[0] == `﻿1`){
    //     subsLinesArr[0] = `1`;
    // }

    let formattedSubs = [];

    function writeOutfile(){
        fs.writeFile('./assets/out.json', JSON.stringify(formattedSubs, null, 4), (err)=>{
            if (err){
                console.log(err);
            }
        })
    }
    console.time(`lop`);
    for (let lineIndex = 0; lineIndex < subsLinesArr.length; lineIndex++){
        if (subsLinesArr[lineIndex] == `﻿${subsLinesArr[lineIndex].substring(1, subsLinesArr.length)}`){
            console.log(`Found ﻿ at index ${lineIndex}`);
            console.log(subsLinesArr[lineIndex]);
            subsLinesArr[lineIndex] = `${subsLinesArr[lineIndex].substring(1, subsLinesArr.length)}`;
            console.log(`Repaired to ${subsLinesArr[lineIndex]}`)
        }
        if (`${counter}` == subsLinesArr[lineIndex]) {
            let time = subsLinesArr[lineIndex+1];
            const line_find = (currentIndex, stringAppend) => {
                if (subsLinesArr[currentIndex + 1] !== '' && subsLinesArr[currentIndex + 1] !== `${counter}`){
                    let text_append = subsLinesArr[currentIndex];
                    return line_find(currentIndex + 1, text_append);
                } else if(subsLinesArr[currentIndex + 1] ==`${counter}`){
                    return `${stringAppend} ${subsLinesArr[currentIndex]}`
                } else {
                    return `${stringAppend} ${subsLinesArr[currentIndex]}`
                }
            }
            let line_txt = line_find(lineIndex+2, '');
            const template = {
                sub_no: counter,
                sub_time: time,
                sub_text: `${line_txt}`
            }
            formattedSubs.push(template);
            counter = counter+1;
        }
        if (counter == 580) {
            writeOutfile();
        }
    }
    console.timeEnd(`lop`);
})

// const readLines = (filedir) =>{
//     return fs.readFileSync(filedir).toString('utf8').split('\n');
// }

// console.log(readLines('./assets/Naomi-S01E01.srt'))