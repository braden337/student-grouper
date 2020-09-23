document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", main)
  : main();

const getStudents = () => JSON.parse(localStorage.getItem("students"));

const getLongestName = () => JSON.parse(localStorage.getItem("longest_name"));

const setStudents = (students) =>
  localStorage.setItem("students", JSON.stringify(students));

const setLongestName = (students) =>
  localStorage.setItem(
    "longest_name",
    JSON.stringify(Math.max(...students.map((name) => name.length)))
  );

const shuffle = (arr) => {
  let tail, i, j;

  tail = n = arr.length;
  i = j = 0;

  while (j++ < n) {
    let random_index = Math.trunc(Math.random() * tail--);
    let picked = arr[random_index];
    if (random_index == tail) continue;
    arr[random_index] = arr[tail];
    arr[tail] = picked;
  }
};

const cell = (student, cellWidth, end) =>
  !end
    ? "| " + student.padEnd(cellWidth) + " | "
    : student.padEnd(cellWidth) + " |\n";

const getGroupsTable = (students) => {
  let cellWidth = getLongestName();
  cellWidth = cellWidth % 2 == 0 ? cellWidth : cellWidth + 1;
  cellWidth *= 1.2;
  cellWidth = cellWidth < 6 ? 7 : cellWidth;
  shuffle(students);
  let table = cell("Group 1", cellWidth, false);
  table += cell("Group 2".padEnd(cellWidth), cellWidth, true);
  table += cell("".padStart(cellWidth, "-"), cellWidth, false);
  table += cell("".padStart(cellWidth, "-"), cellWidth, true);
  let i = 0;
  while (i < students.length) {
    table +=
      i % 2 == 0
        ? cell(students[i], cellWidth, false)
        : cell(students[i], cellWidth, true);
    i++;
  }
  return table;
};

function main() {
  let textarea = document.getElementById("students");
  let output = document.getElementById("output");

  textarea.addEventListener("input", function (event) {
    let students = event.target.value.trim().split("\n");
    setLongestName(students);
    setStudents(students);
    document.documentElement.style.setProperty(
      "--arrow",
      `hsl(${Math.trunc(Math.random() * 360)}deg, 89%, 78%)`
    );
    output.innerHTML =
      students[0] == ""
        ? "Student groups will show up here"
        : getGroupsTable(students);
  });

  output.addEventListener("click", function (event) {
    var range = document.createRange();
    range.selectNode(event.target);
    window.getSelection().addRange(range);

    try {
      document.execCommand("copy");
    } catch (err) {
      console.log("Couldn't copy student groups");
    }

    window.getSelection().removeAllRanges();
  });

  let students = getStudents();
  textarea.value = students.join("\n");
  output.innerHTML =
    students[0] == ""
      ? "Student groups will show up here"
      : getGroupsTable(students);
}
