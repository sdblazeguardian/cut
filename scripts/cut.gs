const DAILY_SHEET = 'Dailies';
const WORKOUT_SHEET = 'Workouts';

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getDailies') {
    return getDailies();
  }

  if (action === 'getWorkouts') {
    return getWorkouts();
  }

  return jsonResponse({
    success: false,
    error: 'Invalid action'
  });
}

function doPost(e) {
  const data = e.parameter;

  if (data.action === 'addDaily') {
    return addDaily(data);
  }

  if (data.action === 'addWorkout') {
    return addWorkout(data);
  }

  return jsonResponse({
    success: false,
    error: 'Invalid action'
  });
}

function getDailies() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DAILY_SHEET);

  const data = sheet.getDataRange().getValues();

  const headers = data.shift();

  const results = data.map(row => {
    let obj = {};

    headers.forEach((header, index) => {
      obj[header] = row[index];
    });

    return obj;
  });

  return jsonResponse(results);
}

function getWorkouts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(WORKOUT_SHEET);

  const data = sheet.getDataRange().getValues();

  const headers = data.shift();

  const results = data.map(row => {
    let obj = {};

    headers.forEach((header, index) => {
      obj[header] = row[index];
    });

    return obj;
  });

  return jsonResponse(results);
}

function addDaily(data) {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(DAILY_SHEET);

  const rows = sheet.getDataRange().getValues();

  const headers = rows[0];

  const dateCol = headers.indexOf('date');
  const userCol = headers.indexOf('user');

  const targetDate = data.date;
  const targetUser = data.user;

  let existingRowIndex = -1;
  let existingRow = null;

  for (let i = 1; i < rows.length; i++) {

    const row = rows[i];

    let rowDate = row[dateCol];

    if (rowDate instanceof Date) {
      rowDate = Utilities.formatDate(
        rowDate,
        'GMT',
        'yyyy-MM-dd'
      );
    } else {
      rowDate = String(rowDate).split('T')[0];
    }

    const rowUser = row[userCol];

    if (rowDate === targetDate && rowUser === targetUser) {
      existingRowIndex = i + 1;
      existingRow = row;
      break;
    }
  }

  const newRow = headers.map((header, index) => {

    const existingValue = existingRow
      ? existingRow[index]
      : '';

    if (header === 'date') {
      return targetDate;
    }

    if (header === 'user') {
      return targetUser;
    }

    /* CHECKBOXES */

    if (
      header === 'vitamin' ||
      header === 'protein_shake' ||
      header === 'lift' ||
      header === 'softball'
    ) {

      if (header in data) {
        return data[header] === 'true';
      }

      return existingValue || false;
    }

    /* NORMAL FIELDS */

    if (
      header in data &&
      data[header] !== ''
    ) {
      return data[header];
    }

    return existingValue;
  });

  if (existingRowIndex > 0) {

    sheet
      .getRange(existingRowIndex, 1, 1, newRow.length)
      .setValues([newRow]);

  } else {

    sheet.appendRow(newRow);

  }

  return jsonResponse({
    success: true
  });
}

function addWorkout(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(WORKOUT_SHEET);

  sheet.appendRow([
    new Date().toISOString(),
    data.date,
    data.user,
    data.exercise,
    data.weight_lbs,
    data.reps,
    data.distance_miles,
    data.duration_minutes,
    data.calories
  ]);

  return jsonResponse({
    success: true
  });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}