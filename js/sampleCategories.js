const defaultCategories = [
  { name: "Birthday", image: "Person" },
  { name: "Holiday", image: "Island" },
  { name: "Event", image: "Event" },
  { name: "Travel", image: "Plane" },
  { name: "Work", image: "Work" }
];

if (!localStorage.getItem("categories")) {
  localStorage.setItem("categories", JSON.stringify(defaultCategories));
}
