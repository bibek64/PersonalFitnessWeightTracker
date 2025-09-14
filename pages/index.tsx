import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { loadExercises, saveExercises, Exercise } from '../lib/storage';

export default function Home() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    setExercises(loadExercises());
  }, []);

  useEffect(() => {
    saveExercises(exercises);
  }, [exercises]);

  function addExercise(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const newExercise: Exercise = { id: Date.now().toString(), name, sets: [] };
    setExercises([...exercises, newExercise]);
    setName('');
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(exercises, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workouts.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ padding: '1rem' }}>
      <h1>Strength Tracker</h1>
      <form onSubmit={addExercise} style={{ marginBottom: '1rem' }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Exercise name"
        />
        <button type="submit">Add Exercise</button>
      </form>
      <ul>
        {exercises.map((ex) => (
          <li key={ex.id}>
            <Link href={`/exercise/${ex.id}`}>{ex.name}</Link>
          </li>
        ))}
      </ul>
      {exercises.length > 0 && (
        <button onClick={exportData} style={{ marginTop: '1rem' }}>
          Export JSON
        </button>
      )}
    </main>
  );
}
