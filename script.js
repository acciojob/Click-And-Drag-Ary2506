const container = document.querySelector(".items");
const items = document.querySelectorAll(".item");

const cols = 5;
const gap = 20;
const size = 100;

// Arrange cubes in a grid initially
items.forEach((item, index) => {
  const row = Math.floor(index / cols);
  const col = index % cols;

  item.style.left = `${col * (size + gap) + gap}px`;
  item.style.top = `${row * (size + gap) + gap}px`;

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  item.addEventListener("mousedown", (e) => {
    dragging = true;
    item.classList.add("active");

    const rect = item.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    item.style.zIndex = "1000";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    const containerRect = container.getBoundingClientRect();

    let left = e.clientX - containerRect.left - offsetX;
    let top = e.clientY - containerRect.top - offsetY;

    // Keep cube inside container
    left = Math.max(0, Math.min(left, container.clientWidth - item.offsetWidth));
    top = Math.max(0, Math.min(top, container.clientHeight - item.offsetHeight));

    item.style.left = left + "px";
    item.style.top = top + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
    item.classList.remove("active");
    item.style.zIndex = "1";
  });
});