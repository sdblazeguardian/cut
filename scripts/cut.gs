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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DAILY_SHEET);

  sheet.appendRow([
    data.date,
    data.user,
    data.distance_miles,
    data.steps,
    data.protein_grams,
    data.bodyweight_lbs,
    data.vitamin,
    data.protein_shake,
    data.lift,
    data.softball
  ]);

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