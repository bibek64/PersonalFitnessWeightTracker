import { useRouter } from 'next/router';
import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { loadExercises, saveExercises, Exercise, WorkoutSet } from '../../lib/storage';

export default function ExercisePage() {
  const router = useRouter();
  const { id } = router.query;
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  useEffect(() => {
    if (typeof id === 'string') {
      const ex = loadExercises().find((e) => e.id === id) || null;
      setExercise(ex);
    }
  }, [id]);

  useEffect(() => {
    if (!exercise) return;
    const exercises = loadExercises().map((e) =>
      e.id === exercise.id ? exercise : e
    );
    saveExercises(exercises);
  }, [exercise]);

  function addSet(e: FormEvent) {
    e.preventDefault();
    if (!exercise) return;
    const set: WorkoutSet = {
      reps: parseInt(reps, 10) || 0,
      weight: parseFloat(weight) || 0
    };
    setExercise({ ...exercise, sets: [...exercise.sets, set] });
    setReps('');
    setWeight('');
  }

  if (!exercise) {
    return <main style={{ padding: '1rem' }}>Loading...</main>;
  }

  return (
    <main style={{ padding: '1rem' }}>
      <h1>{exercise.name}</h1>
      <form onSubmit={addSet} style={{ marginBottom: '1rem' }}>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="Reps"
        />
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
        />
        <button type="submit">Add Set</button>
      </form>
      <ul>
        {exercise.sets.map((s, idx) => (
          <li key={idx}>
            {s.reps} reps @ {s.weight}kg
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <Link href="/">Back</Link>
      </div>
    </main>
  );
}
