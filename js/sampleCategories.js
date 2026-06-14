const defaultCategories = [
  { name: "Birthday", image: null },
  { name: "Holiday", image: null },
  { name: "Event", image: null },
  { name: "Travel", image: null },
  { name: "Work", image: null }
];

if (!localStorage.getItem("categories")) {
  localStorage.setItem("categories", JSON.stringify(defaultCategories));
}
