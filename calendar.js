// planner.js

const calendarDiv = document.getElementById('calendar');

const tasks = {
  "2025-10-15": ["Meeting with team", "Buy groceries", "Workout"],
  "2025-10-20": ["Doctor appointment", "Finish report"],
  // Add more tasks as needed
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// State to track current year/month/day
let currentYear = 2025;
let currentMonth = null; // 0-11
let currentDay = null;

function renderYearlyView(year) {
  currentYear = year;
  currentMonth = null;
  currentDay = null;

  calendarDiv.innerHTML = `<h2>Select a month in ${year}</h2><div class="yearly-grid"></div>`;
  const grid = calendarDiv.querySelector('.yearly-grid');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  grid.style.gap = '10px';

  months.forEach((month, index) => {
    const btn = document.createElement('button');
    btn.textContent = month;
    btn.style.padding = '10px';
    btn.style.fontSize = '1rem';
    btn.style.cursor = 'pointer';
    btn.style.borderRadius = '6px';
    btn.style.border = '1px solid #ccc';
    btn.style.background = '#fff';
    btn.addEventListener('click', () => {
      renderMonthlyView(year, index);
    });
    grid.appendChild(btn);
  });
}

function renderMonthlyView(year, month) {
  currentYear = year;
  currentMonth = month;
  currentDay = null;

  calendarDiv.innerHTML = `
    <div class="month-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
      <button id="backToYear" style="cursor:pointer;">⬅ Year View</button>
      <h2>${months[month]} ${year}</h2>
      <div></div>
    </div>
    <div class="calendar-grid" style="display:grid; grid-template-columns: repeat(7, 1fr); gap:5px;"></div>
    <div id="taskList" style="margin-top:1rem;"></div>
  `;

  document.getElementById('backToYear').onclick = () => {
    renderYearlyView(year);
  };

  const grid = calendarDiv.querySelector('.calendar-grid');

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach(d => {
    const div = document.createElement('div');
    div.textContent = d;
    div.style.fontWeight = '600';
    div.style.textAlign = 'center';
    div.style.padding = '5px 0';
    grid.appendChild(div);
  });

  // Get first day of month and days in month
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Fill in blank cells before first day
  for(let i=0; i<firstDay; i++) {
    const blank = document.createElement('div');
    blank.style.background = '#eee';
    blank.style.borderRadius = '6px';
    grid.appendChild(blank);
  }

  // Days of month
  for(let day=1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.textContent = day;
    dayCell.style.padding = '10px';
    dayCell.style.border = '1px solid #ccc';
    dayCell.style.borderRadius = '6px';
    dayCell.style.textAlign = 'center';
    dayCell.style.cursor = 'pointer';
    dayCell.style.userSelect = 'none';
    dayCell.style.background = '#fff';

    dayCell.addEventListener('click', () => {
      currentDay = day;
      showTasksForDay(year, month, day);
      highlightSelectedDay(dayCell);
    });

    grid.appendChild(dayCell);
  }
}

function highlightSelectedDay(selectedCell) {
  const dayCells = calendarDiv.querySelectorAll('.calendar-grid > div');
  dayCells.forEach(cell => {
    cell.style.background = '#fff';
    cell.style.color = '#000';
  });
  selectedCell.style.background = '#a3cbe8';
  selectedCell.style.color = '#fff';
}

function showTasksForDay(year, month, day) {
  const taskDiv = document.getElementById('taskList');
  const dateKey = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const dayTasks = tasks[dateKey] || [];

  let html = `<h3>Tasks for ${months[month]} ${day}, ${year}</h3>`;

  if(dayTasks.length === 0) {
    html += `<p>No tasks for this day.</p>`;
  } else {
    html += '<ul>';
    dayTasks.forEach(task => {
      html += `<li>${task}</li>`;
    });
    html += '</ul>';
  }

  taskDiv.innerHTML = html;
}

// Initialize to yearly view
renderYearlyView(currentYear);

