// ---- Daily Tracker (with save + daily reset) ----

// Change these tasks anytime:
const tasks = [
    { id: "gym", name: "Gym" },
    { id: "study", name: "Study" },
    { id: "read", name: "Read" },
  ];
  
  // Elements
  const taskList = document.getElementById("taskList");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const status = document.getElementById("status");
  
  // Storage keys
  const STORAGE_KEY = "dailyTrackerState_v1";
  const DAY_KEY = "dailyTrackerDay_v1";
  
  // Helper: get YYYY-MM-DD (local time)
  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  
  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  
  function ensureFreshDay() {
    const lastDay = localStorage.getItem(DAY_KEY);
    const nowDay = todayKey();
  
    // If first run or day changed, reset completion state
    if (lastDay !== nowDay) {
      localStorage.setItem(DAY_KEY, nowDay);
      saveState({}); // clears all checkmarks for the new day
    }
  
    return nowDay;
  }
  
  function render() {
    const day = ensureFreshDay();
    const state = loadState();
  
    taskList.innerHTML = "";
  
    let completed = 0;
  
    for (const task of tasks) {
      const li = document.createElement("li");
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = state[task.id] === true;
  
      checkbox.addEventListener("change", () => {
        const nextState = loadState();
        nextState[task.id] = checkbox.checked;
        saveState(nextState);
        render();
      });
  
      if (checkbox.checked) completed++;
  
      li.appendChild(checkbox);
      li.append(" " + task.name);
      taskList.appendChild(li);
    }
  
    const percent = Math.round((completed / tasks.length) * 100);
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${completed}/${tasks.length} complete (${percent}%)`;
  
    status.textContent =
      percent === 100
        ? `All done for ${day} 🎉`
        : `Today: ${day} — keep going 👍`;
  }
  
  render();