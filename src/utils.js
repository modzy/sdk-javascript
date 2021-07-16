const fs = require('fs');

function readBytes(fd, sharedBuffer) {
    return new Promise((resolve, reject) => {
        fs.read(
            fd,
            sharedBuffer,
            0,
            sharedBuffer.length,
            null,
            (err) => {
                if(err) { return reject(err); }
                resolve();
            }
        );
    });
}

async function* fileToChunks(filePath, size) {
    const sharedBuffer = Buffer.alloc(size);
    const stats = fs.statSync(filePath);
    const fd = fs.openSync(filePath, "r");
    let bytesRead = 0;
    let end = size;
    for(let i = 0; i < Math.ceil(stats.size / size); i++) {
        await readBytes(fd, sharedBuffer);
        bytesRead = (i + 1) * size;
        if(bytesRead > stats.size) {
            end = size - (bytesRead - stats.size);
        }
        yield sharedBuffer.slice(0, end);
    }
    fs.closeSync(fd);
}

async function* byteArrayToChunks(byteArray, size) {
    for(let i = 0; i < byteArray.length; i += size) {
        yield byteArray.slice(i, i+size);
    }
}

module.exports = {
    byteArrayToChunks,
    fileToChunks
};