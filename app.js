const API_URL = 'https://script.google.com/macros/s/AKfycbwpi6cDkAaCv6kmqYDICnFJ4fHVcm_PWaoNvTBYOcJUkyILRUsMTPciV0dtskipN6_Tww/exec';

function showTab(tabId) {
  document.querySelectorAll('.tab-content')
    .forEach(tab => tab.classList.add('hidden'));

  document.getElementById(tabId)
    .classList.remove('hidden');
}

/* DAILY FORM */

document.getElementById('dailyForm')
  .addEventListener('submit', async (e) => {

    e.preventDefault();

    const form = e.target;

    const formData = new FormData();

    /* TEXT/NUMBER FIELDS */

    formData.append('action', 'addDaily');

    formData.append('date', form.date.value);
    formData.append('user', form.user.value);

    formData.append(
      'distance_miles',
      form.distance_miles.value
    );

    formData.append(
      'steps',
      form.steps.value
    );

    formData.append(
      'protein_grams',
      form.protein_grams.value
    );

    formData.append(
      'bodyweight_lbs',
      form.bodyweight_lbs.value
    );

    /* CHECKBOXES */

    formData.append(
      'vitamin',
      form.vitamin.checked
    );

    formData.append(
      'protein_shake',
      form.protein_shake.checked
    );

    formData.append(
      'lift',
      form.lift.checked
    );

    formData.append(
      'softball',
      form.softball.checked
    );

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    console.log(result);

    alert('Daily saved');

    form.reset();

    loadQuickView();
});

/* WORKOUT FORM */

document.getElementById('workoutForm')
  .addEventListener('submit', async (e) => {

    e.preventDefault();

    const formData = new FormData(e.target);

    formData.append('action', 'addWorkout');

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    alert('Workout saved');

    console.log(result);

    e.target.reset();
});

/* QUICK VIEW */

async function loadQuickView() {

  const response = await fetch(
    `${API_URL}?action=getDailies`
  );

  const data = await response.json();

  const container = document.getElementById('quickViewContent');

  container.innerHTML = '';

  data.slice(-10).reverse().forEach(entry => {

    const div = document.createElement('div');

    div.innerHTML = `
      <hr>
      <strong>${entry.user}</strong><br>
      Date: ${new Date(entry.date).toLocaleDateString()}<br>
      Steps: ${entry.steps}<br>
      Protein: ${entry.protein_grams}g<br>
      Weight: ${entry.bodyweight_lbs} lbs
    `;

    container.appendChild(div);
  });
}

loadQuickView();