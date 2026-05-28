const API_URL = 'https://script.google.com/macros/s/AKfycbzK26I6Dk7_125oiZQJsl9bGDfZ8tRBtZyIPBERDM9glXxq7jxA1lwj18Dgf38JSl7XFA/exec';

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

    const formData = new FormData(e.target);

    formData.append('action', 'addDaily');

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    alert('Daily saved');

    console.log(result);

    e.target.reset();

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