function getCurrentDateTime() {
    const now = new Date();
  
    // Get the date components
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
  
    // Get the time components
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    // Combine the date and time components to form the desired format
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    console.log(dateTimeString);
    return dateTimeString;
}


module.exports = {getCurrentDateTime};