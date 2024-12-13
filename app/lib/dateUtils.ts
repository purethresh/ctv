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
  var nowDate = new Date();
  var nowMill = nowDate.getTime();
  nowMill = alignTimeToDay(nowMill);

  // Now figure out how much we need to move forward
  const dayOfWeek = nowDate.getDay();
  var daysToMove = 7 - dayOfWeek;
  if (daysToMove === 7) {
    daysToMove = 0;
  }
  nowMill = nowMill + (daysToMove * 1000 * 60 * 60 * 24);

  // Convert to a string  
  const targetDay = new Date(nowMill);
  const strMonth = String(targetDay.getMonth() + 1).padStart(2, '0');
  const strDay = String(targetDay.getDate()).padStart(2, '0');

  return `${targetDay.getFullYear()}-${strMonth}-${strDay}`;  
}

export const getMinTimeForDay = (dt:Date) : number => {
  const currentTime = new Date(dt);
  currentTime.setHours(0);
  currentTime.setMinutes(0);
  currentTime.setSeconds(0);
  currentTime.setMilliseconds(0);

  return currentTime.getTime();
}

export const getMaxTimeForDay = (dt:Date) : number => {
  const currentTime = new Date(dt);

  // Move to the next day
  currentTime.setDate(currentTime.getDate() + 1);

  currentTime.setHours(0);
  currentTime.setMinutes(0);
  currentTime.setSeconds(0);
  currentTime.setMilliseconds(-1);

  return currentTime.getTime();
}

export const getStartOfPreviousMonth = (dt:Date) : Date => {
  // Make sure we are on the first
  const dateStr = `${dt.getFullYear().toString()}-${(dt.getMonth()+1).toString()}-01`;
  const currentTime = new Date(dateStr);

  currentTime.setMonth(currentTime.getMonth() - 1);
  return currentTime;
}

export const getEndOfNextMonth = (dt:Date) : Date => {
  const dateStr = `${dt.getFullYear().toString()}-${(dt.getMonth()+1).toString()}-01`;
  const currentTime = new Date(dateStr);

  currentTime.setMonth(currentTime.getMonth() + 2);
  currentTime.setDate(currentTime.getDate() - 1);

  return currentTime;
}

export const getDayString = (dt:Date) : string => {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}