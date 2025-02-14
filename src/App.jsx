import React, { useState, useEffect } from 'react'

const CATEGORIES = [
  'Maison',
  'Travail',
  'Courses', 
  'Santé',
  'Sport',
  'Loisirs',
  'Famille',
  'Finances'
]

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : {}
  })
  const [currentCategory, setCurrentCategory] = useState('Maison')
  const [newTaskText, setNewTaskText] = useState('')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (category, text) => {
    if (!text.trim()) return
    const newTask = {
      id: Date.now(),
      text,
      completed: false
    }
    setTasks(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), newTask]
    }))
    setNewTaskText('')
  }

  const toggleTask = (category, id) => {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category].map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }))
  }

  const deleteTask = (category, id) => {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category].filter(task => task.id !== id)
    }))
  }

  const getTotalRemainingTasks = () => {
    return Object.values(tasks).flat().filter(task => !task.completed).length
  }

  const totalTasks = Object.values(tasks).flat().length
  const remainingTasks = getTotalRemainingTasks()

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Gestion des Tâches</h1>
        <p className="task-count">{totalTasks} tâches en cours</p>
        <p className="remaining-tasks">Tâches restantes : {remainingTasks}</p>
        {remainingTasks === 0 && (
          <p className="all-tasks-done">🎉 Bravo ! Toutes les tâches sont terminées. Profitez de votre temps libre ! 🍹</p>
        )}
      </div>

      <div className="nav">
        {CATEGORIES.map(cat => {
          const count = (tasks[cat] || []).filter(task => !task.completed).length
          return (
            <button
              key={cat}
              className={`nav-button ${currentCategory === cat ? 'active' : ''}`}
              onClick={() => setCurrentCategory(cat)}
            >
              {cat}
              {count > 0 && (
                <span className="task-count-badge">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="add-task-container">
        <div className="add-task">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            className="task-input"
          />
          <button 
            onClick={() => addTask(currentCategory, newTaskText)}
            className="add-button"
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="task-list">
        {(tasks[currentCategory] || []).map(task => (
          <div key={task.id} className="task">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(currentCategory, task.id)}
            />
            <span className="task-text">{task.text}</span>
            <span 
              className="delete-icon"
              onClick={() => deleteTask(currentCategory, task.id)}
            >
              🗑️
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
