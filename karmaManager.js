var fs = require('fs');


//read karma.json to fetch current karma status in json format
function loadKarma(){
    if(!fs.existsSync('./karma.json')) return {};
    return JSON.parse(fs.readFileSync('./karma.json','utf8'));
}


//write to karma.json file with updated json data
function saveKarma(data){
    fs.writeFileSync('./karma.json',JSON.stringify(data,null,2));
}

//get a userID's current karma
function getKarma(userID){
    const karma = loadKarma();
    return karma[userID] || 0;
}

//update a user's current karma in the karma.json file
function modifyKarma(userID, amount){
    const karma = loadKarma();
    karma[userID] = (karma[userID] || 0)+amount;
    saveKarma(karma);
    return karma[userID]
}

module.exports = {loadKarma, saveKarma, getKarma, modifyKarma};