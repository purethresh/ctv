export const alignTimeToDay = (mill:number) : number => {
  // A single day
  const singleDay = 1000 * 60 * 60 * 24;
  
  // Adjust for time zone
  const dt = new Date();
  const offset = dt.getTimezoneOffset() * 60 * 1000;

  // Time in UTC
  var result = Math.floor((mill - offset) / singleDay) * singleDay;
  result = result + offset;

  return result;
}

export const getDefaultSunday = () : string => {
  // Get right now in milliseconds
  const nowDate = new Date();
  var nowMill = nowDate.getTime();
  nowMill = alignTimeToDay(nowMill);

  // Now figure out how much we need to move forward
  const dayOfWeek = nowDate.getDay();
  var daysToMove = 6 - dayOfWeek;
  if (daysToMove === 6) {
    daysToMove = 0;
  }
  nowMill = nowMill + (daysToMove * 1000 * 60 * 60 * 24);

  // Convert to a string
  const targetDay = new Date(nowMill);
  return `${targetDay.getFullYear()}-${targetDay.getMonth() + 1}-${targetDay.getDate() + 1}`;  
}