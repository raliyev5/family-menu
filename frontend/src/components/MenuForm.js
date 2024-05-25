import React, { useState } from 'react';

function MenuForm() {
  const [dish, setDish] = useState('');
  const [preference, setPreference] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:8000/api/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dish, preference }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={dish}
        onChange={(e) => setDish(e.target.value)}
        placeholder="Название блюда"
      />
      <input
        type="text"
        value={preference}
        onChange={(e) => setPreference(e.target.value)}
        placeholder="Предпочтения"
      />
      <button type="submit">Сохранить</button>
    </form>
  );
}

export default MenuForm;
