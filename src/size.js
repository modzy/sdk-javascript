
const SIZE_PATTERN = /^(\d+(\.\d+)?)([a-zA-Z]{0,2})$/;

const DataUnit = {
    "i": 1, // BYTES
    "K": 1000, // KILOBYTES
    "M": 1000 * 1000, // MEGABYTES
    "G": 1000 * 1000 * 1000, // GIGABYTES
    "T": 1000 * 1000 * 1000 * 1000, // TERABYTES
    "Ki": 1024, // KIBIBYTES
    "Mi": 1024 * 1024, // MEBIBYTES
    "Gi": 1024 * 1024 * 1024, // GIBIBYTES
    "Ti": 1024 * 1024 * 1024 * 1024, // TEBIBYTES
    "KB": 1024, // KIBIBYTES
    "MB": 1024 * 1024, // MEBIBYTES
    "GB": 1024 * 1024 * 1024, // GIBIBYTES
    "TB": 1024 * 1024 * 1024 * 1024, // TEBIBYTES
}

function humanReadToBytes(humanSize){
    const match = humanSize.match(SIZE_PATTERN);
    return parseInt(match[1])*DataUnit[match[3]]
}

module.exports = humanReadToBytes;