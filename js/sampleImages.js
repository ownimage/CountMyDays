const defaultImages = [
  {
    name: "Person",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%23ff4081' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Ccircle cx='12' cy='8' r='3'/%3E" +
      "%3Cpath d='M5 21c1.5-3 3.5-4.5 7-4.5s5.5 1.5 7 4.5'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Mountain",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%230099ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M3 20h18'/%3E" +
      "%3Cpath d='M4 16l4-8 4 4 4-6 4 10'/%3E" +
      "%3Ccircle cx='8' cy='8' r='1'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Event",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%23ff9800' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='5' width='18' height='16' rx='2' ry='2'/%3E" +
      "%3Cpath d='3 10h18'/%3E" +
      "%3Ccircle cx='8' cy='14' r='1.5'/%3E" +
      "%3Ccircle cx='12' cy='14' r='1.5'/%3E" +
      "%3Ccircle cx='16' cy='14' r='1.5'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Travel",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%233ddc84' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M10 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2z'/%3E" +
      "%3Cpath d='M19 21l-4-4'/%3E" +
      "%3Ccircle cx='19' cy='21' r='2'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Work",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%236673ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='7' width='18' height='13' rx='2' ry='2'/%3E" +
      "%3Cpath d='M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2'/%3E" +
      "%3Cpath d='M3 12h18'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Party",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e91e63' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M4 20l6-14 6 14z'/%3E" +
      "%3Cpath d='M9 6l1-2 1 2'/%3E" +
      "%3Cpath d='M15 6l1-2 1 2'/%3E" +
      "%3Ccircle cx='6' cy='4' r='1'/%3E" +
      "%3Ccircle cx='18' cy='4' r='1'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Cake",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ff7043' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='10' width='18' height='10' rx='2'/%3E" +
      "%3Cpath d='M7 10V6'/%3E" +
      "%3Cpath d='M12 10V6'/%3E" +
      "%3Cpath d='M17 10V6'/%3E" +
      "%3Cpath d='M7 6c0-1 .5-2 1.5-2S10 5 10 6'/%3E" +
      "%3Cpath d='M12 6c0-1 .5-2 1.5-2S15 5 15 6'/%3E" +
      "%3Cpath d='M17 6c0-1 .5-2 1.5-2S20 5 20 6'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Rings",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Ccircle cx='9' cy='15' r='6'/%3E" +
      "%3Ccircle cx='15' cy='15' r='6'/%3E" +
      "%3Cpath d='M15 7l3 3-3 3-3-3z'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Island",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300bcd4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M3 20h18'/%3E" +
      "%3Cpath d='M12 20v-6'/%3E" +
      "%3Cpath d='M12 14c-1-3-4-4-6-3 2-3 5-3 6-1 1-2 4-2 6 1-2-1-5 0-6 3'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Cruise",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2303a9f4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='4' y='7' width='16' height='13' rx='2'/%3E" +
      "%3Cpath d='M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "2 People",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232196f3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M3 18h18l-2 3H5z'/%3E" +
      "%3Cpath d='M5 18l2-7h10l2 7'/%3E" +
      "%3Cpath d='M9 11V7h6v4'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Wedding 2",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ab47bc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Ccircle cx='8' cy='6' r='2'/%3E" +
      "%3Cpath d='M5 20l3-8 3 8'/%3E" +
      "%3Ccircle cx='16' cy='6' r='2'/%3E" +
      "%3Cpath d='M13 20l3-10 3 10'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Music",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ff4081' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M9 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'/%3E" +
      "%3Cpath d='M15 12V4l4-1v8'/%3E" +
      "%3Ccircle cx='15' cy='16' r='3'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Study",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236673ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M3 7l9-4 9 4-9 4z'/%3E" +
      "%3Cpath d='M3 7v6l9 4 9-4V7'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Fitness",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234caf50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='2' y='10' width='4' height='4'/%3E" +
      "%3Crect x='18' y='10' width='4' height='4'/%3E" +
      "%3Cpath d='M6 12h12'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Movies",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ff9800' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='5' width='18' height='14' rx='2'/%3E" +
      "%3Ccircle cx='8' cy='12' r='1'/%3E" +
      "%3Ccircle cx='12' cy='12' r='1'/%3E" +
      "%3Ccircle cx='16' cy='12' r='1'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Gaming",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='9' width='18' height='10' rx='2'/%3E" +
      "%3Cpath d='M8 14h4'/%3E" +
      "%3Cpath d='M10 12v4'/%3E" +
      "%3Ccircle cx='17' cy='13' r='1'/%3E" +
      "%3Ccircle cx='17' cy='16' r='1'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Shopping",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230099ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M6 7l-2 4v8h16v-8l-2-4z'/%3E" +
      "%3Cpath d='M9 7a3 3 0 0 1 6 0'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Home",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a1887f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M3 12l9-8 9 8'/%3E" +
      "%3Crect x='6' y='12' width='12' height='9'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Sun",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300bcd4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Ccircle cx='12' cy='12' r='4'/%3E" +
      "%3Cpath d='M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Plane",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%234caf50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M22 2L11 13'/%3E" +
      "%3Cpath d='M22 2l-7 20-4-11-9-4z'/%3E" +
      "%3C/svg%3E"
  },
];

if (!localStorage.getItem("images")) {
  localStorage.setItem("images", JSON.stringify(defaultImages));
}
