
exports.getTimeStamp = getTimestamp

function getTimestamp() 
{
    const today = new Date();
    const date = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    const timeStamp = `${date}T${time}`;

    return (timeStamp);
}