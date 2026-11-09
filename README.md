# Week 2: DOM & Events App — Daylist To-Do

## Project overview
Daylist is a responsive browser-based to-do application built with HTML, CSS, and vanilla JavaScript. It demonstrates DOM manipulation, event handling, filtering, and persistent browser storage using `localStorage`.

## Features
- Add tasks using the Add task button or Enter key.
- Mark tasks as active or completed.
- Delete individual tasks.
- Filter the list by All, Active, and Completed.
- Clear all completed tasks at once.
- Automatically save tasks in `localStorage` and restore them after refresh/reopening the page.
- Display live task counts and a helpful empty state.
- Responsive layout for desktop and mobile screens.
- Accessible button labels, keyboard-friendly form, and live task-list announcements.

## Technologies and tools
- HTML5 for page structure
- CSS3 for styling and responsive layout
- JavaScript (ES6+) for DOM manipulation and events
- Browser `localStorage` for persistence
- Visual Studio Code and any modern web browser

## Project structure
```text
Week2_DOM_Events_ToDo/
├── Source_Code/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Output/
│   ├── desktop-preview.png
│   └── mobile-preview.png
└── README.md
```

## Installation requirements
No package installation or build tools are required. Use a recent version of Chrome, Edge, Firefox, or Safari.

## How to run
1. Extract the ZIP file.
2. Open the `Week2_DOM_Events_ToDo` folder in Visual Studio Code.
3. Open `Source_Code/index.html` in a browser, or use the VS Code Live Server extension and select **Open with Live Server**.
4. Add a task, mark it completed, try each filter, and delete a task.
5. Refresh the page to verify that tasks remain saved.

## How it works
- The form's `submit` event calls `addTask()` after preventing the default page reload.
- `renderTasks()` creates task elements with DOM methods and attaches click event listeners.
- Filter buttons update `currentFilter`; `getVisibleTasks()` returns the matching tasks.
- `saveTasks()` serializes the task array to `localStorage` as JSON.
- `loadTasks()` safely reads and parses the saved JSON when the app starts.
- A `storage` event listener synchronizes changes between tabs.

## Testing checklist
- [ ] Add a task using the button.
- [ ] Add a task using Enter.
- [ ] Try adding whitespace-only input (it should not create a task).
- [ ] Mark a task completed and active again.
- [ ] Delete a task.
- [ ] Check All, Active, and Completed filters.
- [ ] Clear completed tasks.
- [ ] Refresh the browser and confirm tasks persist.
- [ ] Check the layout at desktop and mobile widths.

## Output description
The `Output` folder contains desktop and mobile preview screenshots of the application. These are included as visual evidence of the completed frontend.

## Notes
Tasks are stored locally in the browser profile on the device where the app is used. Clearing browser site data or using a different browser/device will not transfer the saved tasks.
