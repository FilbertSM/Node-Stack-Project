import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/cards';

const statusColors = {
  finished: '#4ade80', // green
  pending: '#fbbf24', // yellow
};

function Test() {
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await axios.get(API_URL);
      setCards(res.data);
    } catch (err) {
      console.error('Error fetching cards:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ title: '', description: '', status: 'pending' });
      setEditingId(null);
      fetchCards();
    } catch (err) {
      console.error('Error saving card:', err);
    }
  };

  const handleEdit = (card) => {
    setForm({ title: card.title, description: card.description, status: card.status });
    setEditingId(card._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCards();
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: 32 }}>
      <div style={{ maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0001', padding: 32 }}>
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 28, marginBottom: 24, color: '#222' }}>📝 Productive To-Do List</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16 }} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required rows={2} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16, resize: 'vertical' }} />
          <select name="status" value={form.status} onChange={handleChange} style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16 }}>
            <option value="pending">Pending</option>
            <option value="finished">Finished</option>
          </select>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ flex: 1, background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 600, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s' }}>{editingId ? 'Update' : 'Add'} Task</button>
            {editingId && <button type="button" onClick={() => { setForm({ title: '', description: '', status: 'pending' }); setEditingId(null); }} style={{ background: '#e5e7eb', color: '#222', border: 'none', borderRadius: 8, padding: 12, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>}
          </div>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {cards.length === 0 && <div style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>No tasks yet. Add your first to-do!</div>}
          {cards.map(card => (
            <div key={card._id} style={{ background: '#f9fafb', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 20, display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: statusColors[card.status] || '#ddd', marginRight: 6 }}></span>
                <span style={{ fontWeight: 600, fontSize: 18 }}>{card.title}</span>
                <span style={{ marginLeft: 'auto', fontSize: 13, color: '#888', fontWeight: 500 }}>{card.status === 'finished' ? '✔ Finished' : '⏳ Pending'}</span>
              </div>
              <div style={{ color: '#444', fontSize: 15, marginLeft: 20 }}>{card.description}</div>
              <div style={{ fontSize: 12, color: '#aaa', marginLeft: 20 }}>Created: {new Date(card.timestamp).toLocaleString()}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, marginLeft: 20 }}>
                <button onClick={() => handleEdit(card)} style={{ background: '#fbbf24', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(card._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Test;
