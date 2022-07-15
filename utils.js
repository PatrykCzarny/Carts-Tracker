const {
    readFile,
    writeFile,
    copyFile
} = require('fs/promises');

const {
    normalize,
    join
} = require('path');
const Chime = require('chime');



const readJsonFile = async (pathFile) => {
    try {
        const data = await readFile(normalize(pathFile), 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.log(e);
        return false;
    }
}

const writeJsonFile = async (pathFile, data) => {
    try {
        await writeFile(pathFile, JSON.stringify(data))
    } catch (e) {
        console.log(e);
    }
}

const sendUpdateToChime = async (data) => {
    try {
        await Chime.sendMessage(data, `https://hooks.chime.aws/incomingwebhooks/example`);
    } catch (e) {
        console.log(e);
    }
}

const replaceFile = async () => {
    try {
        const fileSource = normalize(join(__dirname, 'static', 'data', 'cartsOnFloors.json'));
        const fileDest = normalize('');
        await copyFile(fileSource, fileDest);
    } catch {}
}

module.exports = {
    readJsonFile,
    writeJsonFile,
    sendUpdateToChime,
    replaceFile
}