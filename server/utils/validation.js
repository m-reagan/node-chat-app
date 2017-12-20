var isRealString = (text) => {
    return (typeof text === 'string' && text.trim().length > 0);
}

module.exports = {isRealString};