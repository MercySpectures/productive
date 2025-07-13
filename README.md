# Productive

A web-based productivity dashboard featuring a To-Do List, Daily Planner, Motivation Quotes, Pomodoro Timer, and Daily Goals.  
Built with HTML, CSS, and JavaScript.  
All data is stored in your browser's localStorage for persistence.

---

## Features

### 📝 To-Do List
- Add, check-off, and delete tasks.
- Tasks are saved in localStorage.
- Completed tasks are visually marked.

### 📅 Daily Planner
- Plan your day by the hour.
- Editable time slots from 6:00 AM to 6:00 AM next day.
- All plans are saved in localStorage.

### 💡 Motivation
- Get a random motivational quote (API-powered).
- Each quote is shown with a random background image.
- "Get Motivation" button fetches a new quote and image.

### ⏲️ Pomodoro Timer
- Set custom focus/break timers.
- Start, pause/resume, and reset the timer.
- Presets for Focus, Short Break, and Long Break.

### 🎯 Daily Goals
- Add and delete daily goals.
- Goals are saved in localStorage.

### 🌦️ Weather & Date/Time
- Shows your current city, weather, and date/time.
- Weather fetched using OpenWeatherMap API (requires your API key).

---

## Getting Started

### 1. Clone or Download

```bash
git clone https://github.com/MercySpectures/productive.git
cd productive
```

### 2. Add API Keys

- **OpenWeatherMap:**  
  In `script.js`, replace `YOUR_API_KEY` with your OpenWeatherMap API key.
- **Quotes API:**  
  In `script.js`, replace `YOUR_API_KEY` in the Motivation section with your [api-ninjas.com](https://api-ninjas.com/api/quotes) key.

### 3. Run Locally

Just open `index.html` in your browser.

---

## Project Structure

```
productive/
│
├── index.html
├── style.css
├── script.js
├── assets/
│   └── chronometer.png
│   └── quote (1).jpeg
│   └── quote (2).jpeg
│   └── ... (background images for quotes)
```

---

## Usage

- **To-Do List:**  
  Click "To Do List" card, add tasks, check them off, or delete.
- **Planner:**  
  Click "Daily Planner" card, fill in your hourly plans.
- **Motivation:**  
  Click "Motivation" card, then "Get Motivation" for a new quote.
- **Pomodoro:**  
  Click "Pomodoro Timer" card, set your timer, and use Start/Pause/Reset.
- **Goals:**  
  Click "Daily Goals" card, add or delete your goals.

---

## Customization

- **Background Images:**  
  Add your own images to the `assets/` folder as `quote (1).jpeg`, `quote (2).jpeg`, etc.
- **Styling:**  
  Edit `style.css` to change the look and feel.

---

## Credits

- [OpenWeatherMap](https://openweathermap.org/api) for weather data.
- [API Ninjas Quotes](https://api-ninjas.com/api/quotes) for motivational quotes.
- UI and code by [@MercySpectures](https://github.com/MercySpectures).

---

## License

This project is for educational and personal use.  
Feel free to fork and modify!

---
