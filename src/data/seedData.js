// Initial company org data. Loaded once; after that the app reads/writes localStorage.
const seed = [
  { id: "stav", type: "person", name: "Stav", title: "CEO", department: "exec", reportsTo: null, imageUrl: "", notes: "" },

  { id: "israel", type: "person", name: "Israel", title: "CPO", department: "product", reportsTo: "stav", imageUrl: "", notes: "" },
  { id: "arthur", type: "person", name: "Arthur", title: "VP Marketing", department: "marketing", reportsTo: "stav", imageUrl: "", notes: "" },
  { id: "ram", type: "person", name: "Ram", title: "VP Growth", department: "marketing", reportsTo: "arthur", imageUrl: "", notes: "" },
  { id: "yinon", type: "person", name: "Yinon", title: "CTO", department: "technology", reportsTo: "stav", imageUrl: "", notes: "" },
  { id: "mira", type: "person", name: "Mira", title: "Operations Manager", department: "operations", reportsTo: "stav", imageUrl: "", notes: "" },

  { id: "ori", type: "person", name: "Ori", title: "Product Manager", department: "product", reportsTo: "israel", imageUrl: "", notes: "" },
  { id: "shiri", type: "person", name: "Shiri", title: "Product Designer", department: "product", reportsTo: "israel", imageUrl: "", notes: "" },

  { id: "polina", type: "person", name: "Polina", title: "Project Manager", department: "technology", reportsTo: "yinon", imageUrl: "", notes: "" },
  { id: "dev-team", type: "team", name: "Development Team", title: "", department: "technology", reportsTo: "yinon", imageUrl: "", notes: "" },

  { id: "customer-support", type: "team", name: "Customer Support", title: "", department: "operations", reportsTo: "mira", imageUrl: "", notes: "1 team member" },
  { id: "finance", type: "team", name: "Finance", title: "", department: "operations", reportsTo: "mira", imageUrl: "", notes: "1 team member" },
  { id: "doctor-management", type: "area", name: "Doctor Management", title: "", department: "operations", reportsTo: "mira", imageUrl: "", notes: "" },
];

export default seed;
