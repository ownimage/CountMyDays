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
  {
    name: "Square",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%23e53935' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='3' width='18' height='18'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Circle",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%2342a5f5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Ccircle cx='12' cy='12' r='9'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Rounded Square",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%2366bb6a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='3' width='18' height='18' rx='4'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Diamond",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%23ff7043' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpolygon points='12,2 22,12 12,22 2,12'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Heart",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%23e91e63' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Thumbs Up",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%23ffa726' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z'/%3E" +
      "%3Cpath d='M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Tick",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%2343a047' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpolyline points='4 12 9 17 20 6'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Cross",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' " +
      "stroke='%23e53935' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cline x1='4' y1='4' x2='20' y2='20'/%3E" +
      "%3Cline x1='20' y1='4' x2='4' y2='20'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Birthday",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M6 10h12v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z'/%3E" +
      "%3Cpath d='M6 10a6 3 0 0 1 12 0'/%3E" +
      "%3Cpath d='M12 2v3'/%3E" +
      "%3Cpath d='M10.5 5c.5-.5.5-1.5 0-2'/%3E" +
      "%3Cpath d='M13.5 5c.5-.5.5-1.5 0-2'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "WeddingRings",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Ccircle cx='9' cy='15' r='5'/%3E" +
      "%3Ccircle cx='15' cy='15' r='5'/%3E" +
      "%3Cpath d='M12 5l2-2 2 2'/%3E" +
      "%3Cpath d='M14 3v3'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "AnniversaryHeart",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M12 20s-5-3.3-7.5-6A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7.5 8c-2.5 2.7-7.5 6-7.5 6z'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Baby",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Ccircle cx='12' cy='10' r='4'/%3E" +
      "%3Cpath d='M8 20c1.5-2 3-3 4-3s2.5 1 4 3'/%3E" +
      "%3Cpath d='M10 10h.01'/%3E" +
      "%3Cpath d='M14 10h.01'/%3E" +
      "%3Cpath d='M11 12c.5.5 1 .5 2 0'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "GraduationCap",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M3 9l9-4 9 4-9 4z'/%3E" +
      "%3Cpath d='M7 11v4a5 5 0 0 0 10 0v-4'/%3E" +
      "%3Cpath d='M21 9v4'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "RetirementPalm",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M12 22v-8'/%3E" +
      "%3Cpath d='M8 9c2-2 4-3 6-3 2 0 4 1 6 3'/%3E" +
      "%3Cpath d='M9 6c1.5-1.5 3-2 4.5-2S16.5 4.5 18 6'/%3E" +
      "%3Cpath d='M6 10c1.5-1 3-1.5 4.5-1.5S13.5 9 15 10'/%3E" +
      "%3Cpath d='M5 22h14'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "MovingHouse",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M3 11l9-7 9 7'/%3E" +
      "%3Cpath d='M5 10v10h14V10'/%3E" +
      "%3Cpath d='M10 20v-5h4v5'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "NewJobBriefcase",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='7' width='18' height='13' rx='2'/%3E" +
      "%3Cpath d='M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2'/%3E" +
      "%3Cpath d='M3 12h18'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "PlaneTrip",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M2 16l20-8-8 8-1 6-3-4-4 2z'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Suitcase",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='4' y='7' width='16' height='13' rx='2'/%3E" +
      "%3Cpath d='M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2'/%3E" +
      "%3Cpath d='M4 12h16'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Beach",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M2 20h20'/%3E" +
      "%3Cpath d='M4 18c2-2 4-3 6-3s4 1 6 3'/%3E" +
      "%3Cpath d='M12 4c-1.5 0-3 .5-4 1.5S6.5 8 6 9.5'/%3E" +
      "%3Cpath d='M12 4c1.5 0 3 .5 4 1.5S17.5 8 18 9.5'/%3E" +
      "%3Cpath d='M12 4v4'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "MountainHike",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M3 20l6-10 4 7 3-5 5 8z'/%3E" +
      "%3Cpath d='M9 10l2-3 2 3'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "CampingTent",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M3 20l7-14 7 14'/%3E" +
      "%3Cpath d='M9 20h6'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "CarTrip",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='10' width='18' height='7' rx='2'/%3E" +
      "%3Cpath d='M6 10l2-4h8l2 4'/%3E" +
      "%3Ccircle cx='7.5' cy='17' r='1.5'/%3E" +
      "%3Ccircle cx='16.5' cy='17' r='1.5'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "ChristmasTree",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M12 2l2 3-2 2-2-2z'/%3E" +
      "%3Cpath d='M6 20h12l-3-4h2l-3-4h2L12 4 8 8h2l-3 4h2z'/%3E" +
      "%3Cpath d='M11 20v2h2v-2'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Fireworks",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M12 3v3'/%3E" +
      "%3Cpath d='M12 18v3'/%3E" +
      "%3Cpath d='M4.2 5.2l2.1 2.1'/%3E" +
      "%3Cpath d='M17.7 18.7l2.1 2.1'/%3E" +
      "%3Cpath d='M3 12h3'/%3E" +
      "%3Cpath d='M18 12h3'/%3E" +
      "%3Cpath d='M4.2 18.8l2.1-2.1'/%3E" +
      "%3Cpath d='M17.7 5.3l2.1-2.1'/%3E" +
      "%3Ccircle cx='12' cy='12' r='2'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Pumpkin",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M9 4c0 1 .5 2 1.5 2.5'/%3E" +
      "%3Cpath d='M15 4c0 1-.5 2-1.5 2.5'/%3E" +
      "%3Cpath d='M7 8c-2 0-3 2-3 4s1 4 3 4'/%3E" +
      "%3Cpath d='M17 8c2 0 3 2 3 4s-1 4-3 4'/%3E" +
      "%3Cpath d='M9 8c-1.5 0-3 2-3 4s1.5 4 3 4'/%3E" +
      "%3Cpath d='M15 8c1.5 0 3 2 3 4s-1.5 4-3 4'/%3E" +
      "%3Cpath d='M9 8h6v8H9z'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "PartyPopper",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M4 20l4-11 7 7z'/%3E" +
      "%3Cpath d='M12 4l1 2'/%3E" +
      "%3Cpath d='M16 4l-1 2'/%3E" +
      "%3Cpath d='M19 7l-2 1'/%3E" +
      "%3Cpath d='M19 11l-2-1'/%3E" +
      "%3Cpath d='M5 5l2 1'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Cocktail",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M4 4h16l-7 7v6l3 3H10l3-3v-6z'/%3E" +
      "%3Cpath d='M9 4l3 3 3-3'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "CoffeeCup",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='4' y='8' width='12' height='9' rx='2'/%3E" +
      "%3Cpath d='M16 10h2a2 2 0 0 1 0 4h-2'/%3E" +
      "%3Cpath d='M5 21h10'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "MusicNote",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Ccircle cx='8' cy='18' r='2'/%3E" +
      "%3Ccircle cx='16' cy='14' r='2'/%3E" +
      "%3Cpath d='M10 18V6l8-2v10'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Calendar",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='4' width='18' height='17' rx='2'/%3E" +
      "%3Cpath d='M8 2v4'/%3E" +
      "%3Cpath d='M16 2v4'/%3E" +
      "%3Cpath d='M3 10h18'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Checklist",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M4 6h9'/%3E" +
      "%3Cpath d='M4 12h9'/%3E" +
      "%3Cpath d='M4 18h9'/%3E" +
      "%3Cpath d='M16 5l2 2 3-3'/%3E" +
      "%3Cpath d='M16 11l2 2 3-3'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "RunningShoe",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M3 17l2-4 4 3 3-5 5 4 2 2'/%3E" +
      "%3Cpath d='M3 17h18v2H3z'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Dumbbell",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='9' width='3' height='6'/%3E" +
      "%3Crect x='18' y='9' width='3' height='6'/%3E" +
      "%3Cpath d='M6 12h12'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "PiggyBank",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M5 11a7 7 0 0 1 11-4h2a2 2 0 0 1 2 2v3h-1l-1 4H7l-1-3H4v-2z'/%3E" +
      "%3Ccircle cx='9' cy='10' r='1'/%3E" +
      "%3Cpath d='M11 5h2'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "GiftBox",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='8' width='18' height='13' rx='2'/%3E" +
      "%3Cpath d='M3 12h18'/%3E" +
      "%3Cpath d='M12 8v13'/%3E" +
      "%3Cpath d='M9 6a2 2 0 1 1 3-2 2 2 0 1 1 3 2'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Camera",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='3' y='6' width='18' height='14' rx='2'/%3E" +
      "%3Ccircle cx='12' cy='13' r='4'/%3E" +
      "%3Cpath d='M8 6l1-2h6l1 2'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Book",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3z'/%3E" +
      "%3Cpath d='M5 4v16a3 3 0 0 1 3-3h9'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "GameController",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Crect x='4' y='9' width='16' height='8' rx='3'/%3E" +
      "%3Cpath d='M9 13h-2'/%3E" +
      "%3Cpath d='M8 12v2'/%3E" +
      "%3Ccircle cx='15' cy='12.5' r='1'/%3E" +
      "%3Ccircle cx='17' cy='14.5' r='1'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "PawPrint",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Ccircle cx='8' cy='8' r='1.5'/%3E" +
      "%3Ccircle cx='16' cy='8' r='1.5'/%3E" +
      "%3Ccircle cx='10' cy='5' r='1.5'/%3E" +
      "%3Ccircle cx='14' cy='5' r='1.5'/%3E" +
      "%3Cpath d='M9 14c1-1 2-1.5 3-1.5s2 .5 3 1.5-1 3-3 3-4-2-3-3z'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Star",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.5L12 15.8 7.2 18l.9-5.5L4.2 8.7l5.4-.8z'/%3E" +
      "%3C/svg%3E"
  },
  {
    name: "Rainbow",
    data:
      "data:image/svg+xml," +
      "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239c27b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E" +
      "%3Cpath d='M5 18a7 7 0 0 1 14 0'/%3E" +
      "%3Cpath d='M7 18a5 5 0 0 1 10 0'/%3E" +
      "%3Cpath d='M9 18a3 3 0 0 1 6 0'/%3E" +
      "%3C/svg%3E"
  },
];

if (!localStorage.getItem("images")) {
  localStorage.setItem("images", JSON.stringify(defaultImages));
}

function reimportSampleImages() {
  const existing = JSON.parse(localStorage.getItem("images") || "[]");
  const existingNames = new Set(existing.map(i => i.name));
  let added = 0;
  defaultImages.forEach(img => {
    if (!existingNames.has(img.name)) {
      existing.push(JSON.parse(JSON.stringify(img)));
      added++;
    }
  });
  localStorage.setItem("images", JSON.stringify(existing));
  const msg = document.getElementById("deleteConfirmMessage");
  if (added > 0) {
    msg.innerHTML = `Added ${added} sample image${added === 1 ? '' : 's'}.`;
  } else {
    msg.innerHTML = "All sample images already exist.";
  }
  document.getElementById("deleteConfirmBtn").textContent = "OK";
  document.getElementById("deleteConfirmBtn").className = "btn btn-primary editor-btn btn-wide";
  document.getElementById("deleteConfirmBtn").onclick = function() {
    bootstrap.Modal.getInstance(document.getElementById("deleteConfirmModal")).hide();
    document.getElementById("deleteConfirmBtn").textContent = "Delete";
    document.getElementById("deleteConfirmBtn").className = "btn btn-danger editor-btn btn-wide";
  };
  new bootstrap.Modal(document.getElementById("deleteConfirmModal")).show();
}
