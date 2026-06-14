const defaultDates = [
  {
    name: "Mum's Birthday",
    category: "Birthday",
    type: "annual",
    month: 7,
    day: 14
  },
  {
    name: "Summer Holiday",
    category: "Holiday",
    type: "once",
    year: 2026,
    month: 8,
    day: 21
  },
  {
    name: "Project Deadline",
    category: "Work",
    type: "once",
    year: 2026,
    month: 6,
    day: 30
  },
  {
    name: "Trip to London",
    category: "Travel",
    type: "once",
    year: 2026,
    month: 7,
    day: 2
  },
  {
    name: "Anniversary Dinner",
    category: "Event",
    type: "annual",
    month: 9,
    day: 3
  }
];

if (!localStorage.getItem("dates")) {
  localStorage.setItem("dates", JSON.stringify(defaultDates));
}
