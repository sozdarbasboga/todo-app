import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// Başlangıç verisi (ilk yüklemede localStorage yoksa)
const INITIAL_TODOS = [
  { done: true, text: 'Taste JavaScript' },
  { done: true, text: 'Code furiously' },
  { done: false, text: 'Promote Mavo' },
  { done: false, text: 'Give talks' },
  { done: true, text: 'Write tutorials' },
  { done: false, text: 'Have a life!' },
];

function App() {
  // State'ler
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  // localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Geriye kalan ve tamamlanan sayısı
  const todoLeft = todos.filter(t => !t.done).length;
  const todoDone = todos.filter(t => t.done).length;

  // Filtrelenmiş todo listesi
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.done;
    if (filter === 'completed') return todo.done;
    return true;
  });

  // Todo ekle
  const handleAddTodo = (e) => {
    e.preventDefault();
    const text = newTodo.trim();
    if (!text) return;
    setTodos([{ text, done: false }, ...todos]);
    setNewTodo('');
  };

  // Tek bir todo'yu güncelle
  const toggleTodo = (idx) => {
    setTodos(todos => todos.map((todo, i) => i === idx ? { ...todo, done: !todo.done } : todo));
  };

  // Todo sil
  const deleteTodo = (idx) => {
    setTodos(todos => todos.filter((_, i) => i !== idx));
  };

  // Tümünü tamamla/geri al
  const toggleAll = (e) => {
    const checked = e.target.checked;
    setTodos(todos => todos.map(todo => ({ ...todo, done: checked })));
  };

  // Tamamlananları temizle
  const clearCompleted = () => {
    setTodos(todos => todos.filter(todo => !todo.done));
  };

  // Enter ile inputa odaklanma
  const inputRef = useRef();
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  // Pluralize fonksiyonu
  const pluralize = (count, one, many) => `${count} ${count === 1 ? one : many}`;

  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              className="new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              autoFocus
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={todoLeft === 0}
              onChange={toggleAll}
              readOnly={false}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>

            <ul className="todo-list">
              {filteredTodos.map((todo, idx) => {
                // Orijinal dizideki index'i bul
                const realIdx = todos.indexOf(todo);
                return (
                  <li
                    key={realIdx}
                    className={todo.done ? 'completed' : ''}
                  >
                    <div className="view">
                      <input
                        className="toggle"
                        type="checkbox"
                        checked={todo.done}
                        onChange={() => toggleTodo(realIdx)}
                      />
                      <label>{todo.text}</label>
                      <button className="destroy" onClick={() => deleteTodo(realIdx)}></button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {todos.length > 0 && (
          <footer className="footer">
            <span className="todo-count">
              {pluralize(todoLeft, 'item', 'items')} left
            </span>
            <ul className="filters">
              <li>
                <a
                  className={filter === 'all' ? 'selected' : ''}
                  onClick={() => setFilter('all')}
                >All</a>
              </li>
              <li>
                <a
                  className={filter === 'active' ? 'selected' : ''}
                  onClick={() => setFilter('active')}
                >Active</a>
              </li>
              <li>
                <a
                  className={filter === 'completed' ? 'selected' : ''}
                  onClick={() => setFilter('completed')}
                >Completed</a>
              </li>
            </ul>
            {todoDone > 0 && (
              <button className="clear-completed" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </footer>
        )}
      </section>
      <footer className="info">
        <p>Click to edit a todo</p>
        <p>Created by <a href="https://d12n.me/">Dmitry Sharabin</a> with <a href="https://mavo.io">Mavo</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </>
  );
}

export default App;
