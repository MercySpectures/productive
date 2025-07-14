var longitude = 0;
var latitude = 0;

var city = document.getElementById("city");
var temp = document.getElementById("temp");
var weatherStatus = document.getElementById("weatherStatus");

var homeDateToday = document.getElementById("date");
var homeTime = document.getElementById("time");

//Date and Time

const monthsList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const daysList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function setDateTime(t, d) {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();
  const day = currentDate.getDay();

  const hour = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  d.innerHTML = `${date} ${monthsList[month]}, ${year}`;
  t.innerHTML = `${daysList[day]}, ${hour < 10 ? "0" + hour : hour}:${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds} ${hour > 12 ? "pm" : "am"}`;
}

setInterval(() => {
  setDateTime(homeTime, homeDateToday);
}, 1000);

function getWeatherData() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${YOUR_API_KEY}`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch weather data");
      return res.json();
    })
    .then((data) => {
      console.log("Weather data:", data); //logging data received
      city.innerHTML = `${
        data.name
      } <span style="font-size:0.8rem; margin-left:5px">(${data.coord.lon.toFixed(
        1
      )}/${data.coord.lat.toFixed(1)})</span>`; //city extraction with coordinates
      temp.innerHTML = `${(data.main.feels_like - 273.15).toFixed(1)}°C`;
      weatherStatus.innerHTML = data.weather[0].description;
      var otherWeatherDetails = [
        `humidity: ${data.main.humidity} %`,
        `pressure: ${data.main.pressure} hPa`,
        `wind: ${data.wind.speed} km/h`,
      ];
      document.querySelector(
          ".dateAndTime .right ul"
        ).innerHTML = "";
      otherWeatherDetails.forEach((e) => {
        document.querySelector(
          ".dateAndTime .right ul"
        ).innerHTML += `<li>${e}</li>`;
      });
    })
    .catch((err) => {
      console.error("Fetch error:", err.message);
    });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (res) => {
        longitude = res.coords.longitude;
        latitude = res.coords.latitude;
        console.log("Coordinates:", longitude, latitude);
        getWeatherData();
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}
getLocation();

//cards selection

function openCards() {
  var tools = document.querySelectorAll(".card");
  var sections = document.querySelectorAll("section");

  tools.forEach((t) => {
    t.addEventListener("click", () => {
      // Hide all sections
      sections.forEach((sec) => {
        sec.style.display = "none";
      });
      // Show the section matching the card's class
      var sectionId = t.classList[1]; // e.g., "todoList"
      var section = document.getElementById(sectionId);
      if (section) section.style.display = "block";
    });
  });

  // Optionally, add close button functionality
  document.querySelectorAll(".close").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest("section").style.display = "none";
    });
  });
}

openCards();

//todo list

var todoList = document.querySelector(".todoList");

var todoItemsList = [];

if (localStorage.getItem("todoItemsList")) {
  todoItemsList = JSON.parse(localStorage.getItem("todoItemsList"));
} else {
  console.log(
    "there is no data in local storage try to create new to do list."
  );
}

var todoCreate = document.querySelector(".addItems button#create");
var todoItemList = document.querySelector(".todoItems");

function renderTodos() {
  localStorage.setItem("todoItemsList", JSON.stringify(todoItemsList));
  todoItemList.innerHTML = "";
  if (todoItemsList.length === 0) {
    todoItemList.innerHTML = `<span>No items yet</span>`;
    return; // Early return if no items
  }
  todoItemsList.forEach((item, index) => {
    todoItemList.innerHTML += `
      <div class="todoItem" data-index="${index}">
        <input type="checkbox" name="completed" class="check" ${
          item.completed ? "checked" : ""
        }>
        <div class="txtContent" style="text-decoration:${
          item.completed ? "line-through" : "none"
        };color:${item.completed ? "#aaa" : "#000"}">
          <h3 class="titleItem">${item.title}</h3>
          <p class="descItem">${item.desc}</p>
        </div>
        <div class="itembtns">
          <button class="delete">delete</button>
        </div>
      </div>`;
  });
  ifChecked();
  deleteTodoItem();
  localStorage.setItem("todoItemsList", JSON.stringify(todoItemsList));
}

todoCreate.addEventListener("click", () => {
  var todoTitleInput = document
    .querySelector(".addItems input#title")
    .value.trim();
  var todoDesInput = document
    .querySelector(".addItems textarea#desc")
    .value.trim();

  if (!todoTitleInput || !todoDesInput) {
    alert("Please fill in both title and description.");
    return;
  }

  todoItemsList.push({
    title: todoTitleInput,
    desc: todoDesInput,
    completed: false,
  });

  renderTodos();

  // Optionally clear inputs
  document.querySelector(".addItems input#title").value = "";
  document.querySelector(".addItems textarea#desc").value = "";
});

var todoItem = document.querySelectorAll(".todoItem");

function ifChecked() {
  document.querySelectorAll(".todoItem").forEach((tdi) => {
    const checkbox = tdi.querySelector(".check");
    const textContent = tdi.querySelector(".txtContent");
    const index = tdi.getAttribute("data-index");

    if (checkbox) {
      checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          textContent.style.textDecoration = "line-through";
          textContent.style.color = "#333";
          todoItemsList[index].completed = true;
        } else {
          textContent.style.textDecoration = "none";
          textContent.style.color = "#000";
          todoItemsList[index].completed = false;
        }
        renderTodos();
      });
    }
  });
}

function deleteTodoItem() {
  document.querySelectorAll(".todoItem .delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const todoItem = e.target.closest(".todoItem");
      const index = todoItem.getAttribute("data-index");
      console.log(index); // Log the index of the item to be deleted
      todoItemsList.splice(index, 1); // Remove the item from the list
      renderTodos(); // Re-render the todo list
    });
  });
}

// Initial render
renderTodos();

//planner

var planner = document.querySelector(".planner");

//set date and time in planner
setInterval(() => {
  setDateTime(
    document.getElementById("plannerTime"),
    document.getElementById("plannerDate")
  );
}, 1000);

//array for hours and data

var plannerList = [
  { titleAsTime: "6:00 am - 7:00 am" },
  { titleAsTime: "7:00 am - 8:00 am" },
  { titleAsTime: "8:00 am - 9:00 am" },
  { titleAsTime: "9:00 am - 10:00 am" },
  { titleAsTime: "10:00 am - 11:00 am" },
  { titleAsTime: "11:00 am - 12:00 pm" },
  { titleAsTime: "12:00 pm - 1:00 pm" },
  { titleAsTime: "1:00 pm - 2:00 pm" },
  { titleAsTime: "2:00 pm - 3:00 pm" },
  { titleAsTime: "3:00 pm - 4:00 pm" },
  { titleAsTime: "4:00 pm - 5:00 pm" },
  { titleAsTime: "5:00 pm - 6:00 pm" },
  { titleAsTime: "6:00 pm - 7:00 pm" },
  { titleAsTime: "7:00 pm - 8:00 pm" },
  { titleAsTime: "8:00 pm - 9:00 pm" },
  { titleAsTime: "9:00 pm - 10:00 pm" },
  { titleAsTime: "10:00 pm - 11:00 pm" },
  { titleAsTime: "11:00 pm - 12:00 am" },
  { titleAsTime: "12:00 am - 1:00 am" },
  { titleAsTime: "1:00 am - 2:00 am" },
  { titleAsTime: "2:00 am - 3:00 am" },
  { titleAsTime: "3:00 am - 4:00 am" },
  { titleAsTime: "4:00 am - 5:00 am" },
  { titleAsTime: "5:00 am - 6:00 am" }
];

if (localStorage.getItem("plannerList")) {
  plannerList = JSON.parse(localStorage.getItem("plannerList"));
} else {
  console.log(
    "there is no data in planner"
  );
}

function getPlanner(){
  plannerList.forEach((plan, idx)=>{
    document.querySelector(".dailyHoursContainer").innerHTML +=
    `
      <div class="dailyHours" data-index="${idx}">
        <label for="title">${plan.titleAsTime}</label>
        <input type="text" name="title" id="title" placeholder="enter your plan" value="${plan.plan ? plan.plan : ""}">
      </div>
    `
  });
}

function editPlanner() {
  document.querySelectorAll(".dailyHours input").forEach((plans) => {
    plans.addEventListener("change", (p) => {
      const plan = p.target.closest(".dailyHours");
      plan.querySelector("input").value = plan.querySelector("input").value.trim();
      console.log(plan.querySelector("input").value.trim());
      plannerList[plan.getAttribute("data-index")].plan = plan.querySelector("input").value.trim();
      localStorage.setItem("plannerList", JSON.stringify(plannerList));
    });
  });
}

function renderPlanner() {
  getPlanner();
  editPlanner();
  localStorage.setItem("plannerList", JSON.stringify(plannerList));
}

renderPlanner();

//motivation

var motivation = document.querySelector(".motivation");

const apiUrl = "https://api.api-ninjas.com/v1/quotes";

function setMotivation() {
  fetch(apiUrl, {
    method: "GET",
    headers: {
      "X-Api-Key": "YOUR_API_KEY", //add your api key to get motivational quotes.
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log(data); // prints the quote
      document.querySelector(".quote h3").innerHTML = `"${data[0]["quote"]}"`;
      document.querySelector(
        ".quote span"
      ).innerHTML = `"${data[0]["author"]}"`;
    })
    .catch((error) => {
      console.error(error);
    });
}

setMotivation();

document.querySelector(".quote button").addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * 15) + 1; // 1 to 15
  document.querySelector(
    ".content .quote"
  ).style.backgroundImage = `url('./assets/quote (${randomIndex}).jpeg')`;
  setMotivation();
});


//pomodor

var pomodoro = document.querySelector(".pomodoro");

var titlePomodoro = document.querySelector(".timerDetails input#title");
var hoursPomodoro = document.querySelector(".timerDetails input#hours");
var minutesPomodoro = document.querySelector(".timerDetails input#minutes");
var secondsPomodoro = document.querySelector(".timerDetails input#seconds");

var setPomodoro = document.querySelector(".createSetValues button#set");
var focusPomodoro = document.querySelector(".createSetValues button#focus");
var shortPomodoro = document.querySelector(".createSetValues button#shortBreak");
var longPomodoro = document.querySelector(".createSetValues button#longBreak");

var startPomodoro = document.querySelector(".startReset button#create");
var resetPomodoro = document.querySelector(".startReset button#reset");
var pausePomodoro = document.querySelector(".startReset button#pause");

var interval;        // For setInterval reference
var totalSeconds;    // Shared total time left
var isPaused = false;

/* startPomodoro.addEventListener("click", ()=>{
  var h = parseInt(hoursPomodoro.value, 10);
  var m = parseInt(minutesPomodoro.value, 10);
  var s = parseInt(secondsPomodoro.value, 10);

  console.log(h + ":" + m + ":" + s);

  totalSeconds = h * 3600 + m * 60 + s;

  if(isNaN(totalSeconds) || totalSeconds <= 0){
    alert("enter valid values");
    return;
  }

  startPomodoro.disabled = true;
  startPomodoro.style.cursor = "none";

  interval = setInterval(()=>{
    if(totalSeconds <= 0){
      clearInterval(interval);
      document.querySelector("#pomodoroTimer").innerHTML = `<h1>Time's up!</h1>`;
      startPomodoro.disabled = false;
      startPomodoro.style.cursor = "pointer";
      return;
    }

    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    document.querySelector("#pomodoroTimer").innerHTML = `
      <h1><span>${titlePomodoro.value}</span> ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}</h1>
    `;


  }, 1000)

  
  titlePomodoro.value = "";
  hoursPomodoro.value = "";
  minutesPomodoro.value = "";
  secondsPomodoro.value = "";
})
 */

startPomodoro.addEventListener("click", () => {
  let h = parseInt(hoursPomodoro.value, 10);
  let m = parseInt(minutesPomodoro.value, 10);
  let s = parseInt(secondsPomodoro.value, 10);

  totalSeconds = h * 3600 + m * 60 + s;

  if (isNaN(totalSeconds) || totalSeconds <= 0) {
    alert("Enter valid values");
    return;
  }

  startPomodoro.disabled = true;
  startPomodoro.style.cursor = "none";

  interval = setInterval(updateTimer, 1000);

  hoursPomodoro.value = "";
  minutesPomodoro.value = "";
  secondsPomodoro.value = "";
});

function updateTimer() {

  if (totalSeconds <= 0) {
    clearInterval(interval);
    document.querySelector("#pomodoroTimer").innerHTML = `<h1>Time's up!</h1>`;
    startPomodoro.disabled = false;
    startPomodoro.style.cursor = "pointer";
    return;
  }

  console.log(titlePomodoro.value);

  totalSeconds--;

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  document.querySelector("#pomodoroTimer").innerHTML = `
    <h1><span>${titlePomodoro.value}</span> ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}</h1>
  `;
}

pausePomodoro.addEventListener("click", () => {
  if (!isPaused) {
    clearInterval(interval);
    isPaused = true;
    pausePomodoro.innerText = "Resume";
  } else {
    interval = setInterval(updateTimer, 1000);
    isPaused = false;
    pausePomodoro.innerText = "Pause";
  }
});


resetPomodoro.addEventListener("click", ()=>{

  clearInterval(interval);

  titlePomodoro.value = "set values";
  hoursPomodoro.value = "00";
  minutesPomodoro.value = "00";
  secondsPomodoro.value = "00";

  document.querySelector("#pomodoroTimer").innerHTML = `
    <h1><span>${titlePomodoro.value}</span>${hoursPomodoro.value}:${minutesPomodoro.value}:${secondsPomodoro.value}</h1>
  `
  startPomodoro.disabled = false;
  startPomodoro.style.cursor = "pointer";

  isPaused = false;
  pausePomodoro.innerText = "Pause";
})


focusPomodoro.addEventListener("click", ()=>{
  titlePomodoro.value = "focus";
  hoursPomodoro.value = "01";
  minutesPomodoro.value = "00";
  secondsPomodoro.value = "00";
})

shortPomodoro.addEventListener("click", ()=>{
  titlePomodoro.value = "short break";
  hoursPomodoro.value = "00";
  minutesPomodoro.value = "15";
  secondsPomodoro.value = "00";
})

longPomodoro.addEventListener("click", ()=>{
  titlePomodoro.value = "long break";
  hoursPomodoro.value = "00";
  minutesPomodoro.value = "30";
  secondsPomodoro.value = "00";
})

setPomodoro.addEventListener("click", ()=>{
  if(hoursPomodoro.value < 0 || minutesPomodoro.value > 60 || minutesPomodoro.value < 0 || secondsPomodoro.value > 60 || secondsPomodoro.value < 0){
    alert("minutes and seconds should not be less than 0 and greater than 60")
  }else{
    document.querySelector("#pomodoroTimer").innerHTML = `
    <h1><span>${titlePomodoro.value}</span>${hoursPomodoro.value}:${minutesPomodoro.value}:${secondsPomodoro.value}</h1>
  `
  }

})

//goals


setInterval(() => {
  setDateTime(
    document.getElementById("goalTime"),
    document.getElementById("goalDate")
  );
}, 1000);

var goals = document.querySelector(".goals");


var goalsList = [];

if (localStorage.getItem("goalsList")) {
  goalsList = JSON.parse(localStorage.getItem("goalsList"));
} else {
  console.log(
    "there is no data in local storage try to create new goals."
  );
}

var goalsCreate = document.querySelector(".addGoals button#create");
var goalItemList = document.querySelector(".goalItems");

function renderGoals() {
  localStorage.setItem("goalsList", JSON.stringify(goalsList));
  goalItemList.innerHTML = "";
  if (goalsList.length === 0) {
    goalItemList.innerHTML = `<span>No items yet</span>`;
    return; // Early return if no items
  }
  goalsList.forEach((item, index) => {
    goalItemList.innerHTML += `
      <div class="goalItem" data-index="${index}">
        <div class="txtContent">
          <h3 class="titleItem">${item.title}</h3>
          <p class="descItem">${item.desc}</p>
        </div>
        <div class="goalbtns">
          <button class="delete">delete</button>
        </div>
      </div>`;
  });
  deleteGoalItem();
  localStorage.setItem("goalsList", JSON.stringify(goalsList));
}

goalsCreate.addEventListener("click", () => {
  console.log("goal created button clicked");
  var goalTitleInput = document.querySelector(".addGoals input#title").value.trim();
  var goalDesInput = document.querySelector(".addGoals textarea#desc").value.trim();

  console.log(`${goalTitleInput}, ${goalDesInput}`);

  if (!goalTitleInput || !goalDesInput) {
    alert("Please fill in both title and description.");
    return;
  }

  goalsList.push({
    title: goalTitleInput,
    desc: goalDesInput,
  });

  renderGoals();

  // Optionally clear inputs
  document.querySelector(".addGoals input#title").value = "";
  document.querySelector(".addGoals textarea#desc").value = "";
});

var goalItem = document.querySelectorAll(".goalItem");

function deleteGoalItem() {
  document.querySelectorAll(".goalItem .delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const goalItem = e.target.closest(".goalItem");
      const index = goalItem.getAttribute("data-index");
      console.log(index); // Log the index of the item to be deleted
      goalsList.splice(index, 1); // Remove the item from the list
      renderGoals(); // Re-render the goals list
    });
  });
}

// Initial render
renderGoals();
