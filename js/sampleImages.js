// Colourful SVG icons using URL-encoded inline SVG (no Base64)

const defaultImages = [
  {
    name: "Birthday",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%23ff4081' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Ccircle cx='12' cy='8' r='3'/%3E" +
      "%3Cpath d='M5 21c1.5-3 3.5-4.5 7-4.5s5.5 1.5 7 4.5'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Holiday",
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
      "%3Cpath d='M3 10h18'/%3E" +
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
  }
];

if (!localStorage.getItem("images")) {
  localStorage.setItem("images", JSON.stringify(defaultImages));
}
