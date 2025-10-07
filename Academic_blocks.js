// Academic calendar blocks as date ranges
const blocks = [
  { name: "Block 1", start: new Date(2025, 8, 29), end: new Date(2025, 10, 14), className: "block1" },  // Sep 29 - Nov 14
  { name: "Block 2", start: new Date(2025, 10, 24), end: new Date(2026, 0, 28), className: "block2" },  // Nov 24 - Jan 28 (spanning years)
  { name: "Block 3", start: new Date(2026, 2, 2), end: new Date(2026, 3, 1), className: "block3" },      // Mar 2 - Apr 1
  { name: "Block 4", start: new Date(2026, 3, 20), end: new Date(2026, 5, 5), className: "block3" },     // Apr 20 - Jun 5 (use block3 color for example)
];

// Christmas break inside Block 2
const breaks = [
  { name: "Christmas Break", start: new Date(2025, 11, 13), end: new Date(2026, 0, 4) },  // Dec 13 - Jan 4
];

const calendarEl = document.getElementById("calendar");

let currentYear = 2025;
let currentMonth = 9; // October (0-based month index, so 9 = Oct)

function isDateInRange(date, range) {
  return date >= range.start && date <= range.end;
}

function getBlockClassForDate(date) {
  for (const b of blocks) {
    if (isDateInRange(date, b)) {
      return b.className;
    }
  }
  for (const brk of breaks) {
    if (isDateInRange(date, brk)) {
      return "break";
    }
  }
  return "";
}

function generateCalendar(year, month) {
  calendarEl.innerHTML = "";

  // Month header with navigation
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const header = document.createElement("div");
  header.className = "month-header";

  const prevArrow = document.createElement("span");
  prevArrow.className = "nav-arrow";
  prevArrow.textContent = "←";
  prevArrow.onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
  };

  const nextArrow = document.createElement("span");
  nextArrow.className = "nav-arrow";
  nextArrow.textContent = "→";
  nextArrow.onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
  };

  const monthTitle = document.createElement("h2");
  monthTitle.textContent = `${monthNames[month]} ${year}`;

  header.appendChild(prevArrow);
  header.appendChild(monthTitle);
  header.appendChild(nextArrow);
  calendarEl.appendChild(header);

  // Calendar grid container
  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  // Weekday headers
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach(day => {
    const dayNameEl = document.createElement("div");
    dayNameEl.className = "day-name";
    dayNameEl.textContent = day;
    grid.appendChild(dayNameEl);
  });

  // Calculate first day of month and days in month
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days from previous month to fill grid
  const prevMonthDays = firstWeekday;

  // Last day of previous month
  const prevMonthLastDate = new Date(year, month, 0).getDate();

  // Add previous month's trailing days as inactive
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDate - i;
    const dayCell = document.createElement("div");
    dayCell.className = "day-cell inactive";
    dayCell.textContent = dayNum;
    grid.appendChild(dayCell);
  }

  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const blockClass = getBlockClassForDate(date);

    const dayCell = document.createElement("div");
    dayCell.className = "day-cell";
    if (blockClass) {
      dayCell.classList.add(blockClass);
    }

    // Day number element
    const dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.textContent = day;
    dayCell.appendChild(dayNumber);

    // Label for block or break
    if (blockClass) {
      const label = document.createElement("div");
      label.className = "label";
      // Find block or break name
      const foundBlock = blocks.find(b => isDateInRange(date, b));
      const foundBreak = breaks.find(brk => isDateInRange(date, brk));
      if (foundBlock) label.textContent = foundBlock.name;
      else if (foundBreak) label.textContent = "Break";
      dayCell.appendChild(label);
    }

    // Optional: click handler for day details
    dayCell.onclick = () => {
      alert(`You clicked on ${date.toDateString()}`);
      // Here you can expand to show daily schedule or activities
    };

    grid.appendChild(dayCell);
  }

  // Fill trailing days from next month to complete 6 weeks (42 cells)
  const totalCells = prevMonthDays + daysInMonth;
  const nextDays = totalCells <= 35 ? 42 - totalCells : 49 - totalCells;

  for (let i = 1; i <= nextDays; i++) {
    const dayCell = document.createElement("div");
    dayCell.className = "day-cell inactive";
    dayCell.textContent = i;
    grid.appendChild(dayCell);
  }

  calendarEl.appendChild(grid);
}

// Initialize calendar
generateCalendar(currentYear, currentMonth);
