import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../components/NavBar';

const CARD_PER_VIEW = 4; // Disesuaikan agar ada ruang untuk tombol

// --- Komponen CardSlider di-refactor untuk menyertakan tombol aksi ---
const CardSlider = ({ data, onUpdate, onDelete, isLoading, error }) => {
  const [start, setStart] = useState(0);

  if (isLoading) return <p className="text-gray-500">Loading tasks...</p>;
  if (error) return <p className="text-red-500">Failed to load tasks: {error}</p>;
  if (data.length === 0) return <p className="text-gray-500">No tasks in this list yet.</p>;

  const canPrev = start > 0;
  const canNext = start + CARD_PER_VIEW < data.length;

  return (
    <div className="relative w-full">
      
      <button onClick={() => canPrev && setStart(start - 1)} disabled={!canPrev} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30">&#8592;</button>
      
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${start * (100 / CARD_PER_VIEW)}%)` }}>
          {data.map((item) => (
            <div key={item._id} className="min-w-0 w-[250px] mx-2 bg-blue-50 rounded-lg shadow p-4 flex flex-col justify-between flex-shrink-0" style={{ flex: `0 0 calc(100%/${CARD_PER_VIEW})` }}>
              <div>
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.description}</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                {/* Tombol Hapus */}
                <button onClick={() => onDelete(item._id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                {/* Tombol Update Status */}
                <button onClick={() => onUpdate(item._id, item.status === 'undone' ? 'done' : 'undone')} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                  {item.status === 'undone' ? 'Mark as Done' : 'Mark as Undone'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => canNext && setStart(start + 1)} disabled={!canNext} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30">&#8594;</button>
    </div>
  );
};


// --- Komponen Utama Home ---
const Home = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef(null); // Ref untuk dialog modal
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  // Fungsi untuk mengambil semua kartu
  const fetchCards = async () => {
    try {
      const res = await fetch('/api/cards');
      if (!res.ok) throw new Error('Failed to fetch data.');
      const data = await res.json();
      setCards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // --- Fungsi CRUD ---

  // CREATE: Menangani penambahan tugas baru
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, status: 'undone' }),
      });
      if (!res.ok) throw new Error('Failed to add task.');
      const addedCard = await res.json();
      setCards(prev => [...prev, addedCard]); 
      setNewTask({ title: '', description: '' }); // Reset form
      modalRef.current.close(); // Tutup modal
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update task.');
      const updatedCard = await res.json();
      setCards(prev => prev.map(c => c._id === id ? updatedCard : c));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/cards/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task.');
      setCards(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const undoneCards = cards.filter(card => card.status === 'undone');
  const doneCards = cards.filter(card => card.status === 'done');

  return (
    <div>
      <NavBar />
      <main className="flex flex-col items-center px-4 py-16 gap-8 mt-24">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Welcome to <span className="text-blue-600">DoNote</span></h1>
          <p className="text-lg text-gray-600 text-center mb-6">Organize Your Day, Achieve More.</p>
          <button onClick={() => modalRef.current.showModal()} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Add New Task</button>
        </div>

        {/* Modal untuk menambah tugas baru */}
        <dialog ref={modalRef} className="p-0 rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Create a New Task</h2>
            <form onSubmit={handleAddTask} className="flex flex-col gap-4">
              <input type="text" placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required className="border p-2 rounded w-full" />
              <textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} required className="border p-2 rounded w-full min-h-[100px]"></textarea>
              <div className="flex justify-end gap-4 mt-2">
                <button type="button" onClick={() => modalRef.current.close()} className="bg-gray-200 px-4 py-2 rounded-lg">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add Task</button>
              </div>
            </form>
          </div>
        </dialog>

        <div className="flex flex-col gap-8 w-full max-w-[1200px]">
          <section className="h-[260px] bg-white rounded-xl shadow-md flex flex-col items-start p-6">
            <h2 className="font-bold text-xl mb-4 text-gray-800">Undone List</h2>
            <CardSlider data={undoneCards} onUpdate={handleUpdateStatus} onDelete={handleDelete} isLoading={loading} error={error} />
          </section>
          <section className="h-[260px] bg-white rounded-xl shadow-md flex flex-col items-start p-6">
            <h2 className="font-bold text-xl mb-4 text-gray-800">Done List</h2>
            <CardSlider data={doneCards} onUpdate={handleUpdateStatus} onDelete={handleDelete} isLoading={loading} error={error} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;