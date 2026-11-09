'use strict';

const STORAGE_KEY = 'daylist.tasks.v1';
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter-button');
const clearCompletedButton = document.getElementById('clearCompleted');
let currentFilter = 'all';
let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(task => task && typeof task.id === 'string' && typeof task.text === 'string') : [];
  } catch (error) {
    console.warn('Could not read saved tasks:', error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Could not save tasks:', error);
    document.getElementById('inputHint').textContent = 'Storage is unavailable in this browser session.';
  }
}

function addTask(text) {
  const cleanText = text.trim();
  if (!cleanText) return;
  tasks.unshift({ id: createId(), text: cleanText, completed: false, createdAt: new Date().toISOString() });
  saveTasks();
  currentFilter = 'all';
  updateActiveFilter();
  renderTasks();
}

function createId() {
  return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toggleTask(id) {
  tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function getVisibleTasks() {
  if (currentFilter === 'active') return tasks.filter(task => !task.completed);
  if (currentFilter === 'completed') return tasks.filter(task => task.completed);
  return tasks;
}

function updateActiveFilter() {
  filterButtons.forEach(button => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskList.replaceChildren();

  visibleTasks.forEach(task => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;

    const checkButton = document.createElement('button');
    checkButton.className = 'task-check';
    checkButton.type = 'button';
    checkButton.setAttribute('aria-label', task.completed ? `Mark ${task.text} as active` : `Mark ${task.text} as completed`);
    checkButton.setAttribute('aria-pressed', String(task.completed));
    checkButton.textContent = task.completed ? '✓' : '';
    checkButton.addEventListener('click', () => toggleTask(task.id));

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const meta = document.createElement('span');
    meta.className = 'task-meta';
    meta.textContent = task.completed ? 'Completed' : 'In progress';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', `Delete ${task.text}`);
    deleteButton.title = 'Delete task';
    deleteButton.textContent = '×';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    item.append(checkButton, text, meta, deleteButton);
    taskList.append(item);
  });

  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.length - activeCount;
  document.getElementById('allCount').textContent = tasks.length;
  document.getElementById('activeCount').textContent = activeCount;
  document.getElementById('completedCount').textContent = completedCount;
  document.getElementById('progressText').textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} left`;
  document.getElementById('footerCount').textContent = `${tasks.length} ${tasks.length === 1 ? 'item' : 'items'}`;
  emptyState.classList.toggle('hidden', visibleTasks.length > 0);
  clearCompletedButton.disabled = completedCount === 0;
  clearCompletedButton.style.opacity = completedCount === 0 ? '.45' : '1';
}

taskForm.addEventListener('submit', event => {
  event.preventDefault();
  addTask(taskInput.value);
  taskInput.value = '';
  taskInput.focus();
  document.getElementById('inputHint').textContent = 'Press Enter to quickly add a task.';
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    updateActiveFilter();
    renderTasks();
  });
});

clearCompletedButton.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// Show the current date in the page header.
const today = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
document.getElementById('todayLabel').textContent = today;

// Keep multiple open tabs in sync when localStorage changes.
window.addEventListener('storage', event => {
  if (event.key === STORAGE_KEY) {
    tasks = loadTasks();
    renderTasks();
  }
});

renderTasks();
