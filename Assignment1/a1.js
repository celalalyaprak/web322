/*********************************************************************************
*  WEB322 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: CELAL ALYAPRAK Student ID: 177177235  Date: 2025-05-15
*
********************************************************************************/

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Do you wish to process a File (f) or Directory (d): ", function(choice) {
    choice = choice.trim().toLowerCase();

    if (choice === 'f') {
        rl.question("File: ", function(filePath) {
            processFile(filePath.trim());
            rl.close();
        });
    } else if (choice === 'd') {
        rl.question("Directory: ", function(dirPath) {
            processDirectory(dirPath.trim());
            rl.close();
        });
    } else {
        console.log("Invalid Selection");
        rl.close();
    }
});

function processDirectory(dirPath) {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.log(err.message);
            return;
        }

        const sorted = files.sort().reverse();
        console.log("Files (reverse alphabetical order):", sorted.join(", "));

        sorted.forEach(file => {
            const fullPath = path.join(dirPath, file);
            fs.stat(fullPath, (err, stats) => {
                if (!err && stats.isFile()) {
                    console.log(`${file}: ${stats.size} bytes`);
                }
            });
        });
    });
}

function processFile(filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err.message);
            return;
        }

        const content = data.toString().replace(/\s+/g, ' ').trim();
        const wordArray = content.replace(/[^\w\s']/g, "").split(' ').filter(Boolean);

        const charCount = content.length;
        const wordCount = wordArray.length;
        const longestWord = wordArray.reduce((a, b) => b.length > a.length ? b : a, "");

        console.log(`Number of Characters (including spaces): ${charCount}`);
        console.log(`Number of Words: ${wordCount}`);
        console.log(`Longest Word: ${longestWord}`);

        const wordFreq = {};
        wordArray.forEach(word => {
            word = word.toLowerCase();
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });

        let mostWord = "";
        let mostCount = 0;
        for (const word in wordFreq) {
            if (wordFreq[word] > mostCount) {
                mostWord = word;
                mostCount = wordFreq[word];
            }
        }

        console.log(`Most Repeated Word: ${mostWord} - ${mostCount} times`);
    });
}
