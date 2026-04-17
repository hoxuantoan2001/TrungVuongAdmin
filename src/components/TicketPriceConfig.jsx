import { DollarSign, Edit3, Plus, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { cx } from '../data';

const INITIAL_TICKET_TYPES = [
  { id: 1, name: 'VVIP', basePrice: 1500000, description: 'Hàng ghế VIP đầu tiên, tặng đồ uống & chương trình đặc biệt', color: '#7c3aed', active: true },
  { id: 2, name: 'VIP', basePrice: 800000, description: 'Hàng ghế VIP, view sân khấu tốt nhất', color: '#2563eb', active: true },
  { id: 3, name: 'Standard', basePrice: 400000, description: 'Khu vực tiêu chuẩn, ghế ngồi thoải mái', color: '#10b981', active: true },
  { id: 4, name: 'Economic', basePrice: 200000, description: 'Khu vực phổ thông, giá ưu đãi', color: '#f59e0b', active: true },
];

const PRICE_MODIFIERS = [
  { id: 1, name: 'Cuối tuần (T7, CN)', modifier: 1.2, type: 'multiply', active: true },
  { id: 2, name: 'Lễ / Tết', modifier: 1.5, type: 'multiply', active: true },
  { id: 3, name: 'Early Bird (30 ngày trước)', modifier: 0.85, type: 'multiply', active: true },
  { id: 4, name: 'Đặt nhóm (≥ 10 vé)', modifier: 0.9, type: 'multiply', active: true },
  { id: 5, name: 'B2B Partner', modifier: 0.8, type: 'multiply', active: false },
];

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export default function TicketPriceConfig() {
  const [ticketTypes, setTicketTypes] = useState(INITIAL_TICKET_TYPES);
  const [modifiers, setModifiers] = useState(PRICE_MODIFIERS);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState({ name: '', basePrice: '', description: '', color: '#6366f1' });

  const startEdit = (ticket) => {
    setEditingId(ticket.id);
    setEditForm({ ...ticket });
  };

  const saveEdit = () => {
    setTicketTypes(prev => prev.map(t => t.id === editingId ? { ...editForm, basePrice: Number(editForm.basePrice) } : t));
    setEditingId(null);
  };

  const addTicketType = () => {
    if (!newType.name || !newType.basePrice) return;
    setTicketTypes(prev => [...prev, { ...newType, id: Date.now(), basePrice: Number(newType.basePrice), active: true }]);
    setNewType({ name: '', basePrice: '', description: '', color: '#6366f1' });
    setShowAddForm(false);
  };

  const deleteType = (id) => {
    setTicketTypes(prev => prev.filter(t => t.id !== id));
  };

  const toggleModifier = (id) => {
    setModifiers(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cấu hình giá vé</h2>
          <p className="text-sm font-medium text-slate-500">Quản lý các hạng vé và chính sách giá</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all"
        >
          <Plus size={18} /> Thêm hạng vé
        </button>
      </div>

      {/* Add new form */}
      {showAddForm && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 animate-in slide-in-from-top-2 duration-300">
          <h3 className="text-lg font-black text-slate-900 mb-4">Thêm hạng vé mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Tên hạng vé</label>
              <input
                type="text"
                value={newType.name}
                onChange={e => setNewType(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VD: Premium"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Giá cơ bản (VND)</label>
              <input
                type="number"
                value={newType.basePrice}
                onChange={e => setNewType(prev => ({ ...prev, basePrice: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="600000"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Mô tả</label>
              <input
                type="text"
                value={newType.description}
                onChange={e => setNewType(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mô tả ngắn..."
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Màu sắc</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={newType.color}
                  onChange={e => setNewType(prev => ({ ...prev, color: e.target.value }))}
                  className="w-12 h-12 rounded-xl border-0 cursor-pointer"
                />
                <span className="text-sm font-bold text-slate-500">{newType.color}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={addTicketType} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition">
              <Save size={16} /> Lưu
            </button>
            <button onClick={() => setShowAddForm(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition">
              <X size={16} /> Huỷ
            </button>
          </div>
        </div>
      )}

      {/* Ticket Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ticketTypes.map(ticket => (
          <div key={ticket.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
            <div className="h-2" style={{ backgroundColor: ticket.color }} />
            {editingId === ticket.id ? (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Tên</label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Giá (VND)</label>
                    <input type="number" value={editForm.basePrice} onChange={e => setEditForm(p => ({ ...p, basePrice: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Mô tả</label>
                  <input type="text" value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition">
                    <Save size={14} /> Lưu
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition">
                    <X size={14} /> Huỷ
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-slate-900">{ticket.name}</span>
                      <span className={cx(
                        "text-[10px] font-black uppercase px-2 py-0.5 rounded-lg",
                        ticket.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      )}>
                        {ticket.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{ticket.description}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => startEdit(ticket)} className="p-2 rounded-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => deleteType(ticket.id)} className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Giá cơ bản</div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{formatVND(ticket.basePrice)}</div>
                </div>
                {/* Preview with modifiers */}
                <div className="mt-3 space-y-1.5">
                  {modifiers.filter(m => m.active).map(m => (
                    <div key={m.id} className="flex items-center justify-between text-[12px] px-3 py-1.5 rounded-lg bg-blue-50/50">
                      <span className="font-bold text-slate-600">{m.name}</span>
                      <span className="font-black text-blue-600">{formatVND(Math.round(ticket.basePrice * m.modifier))}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Price Modifiers */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600">
            <DollarSign size={22} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Chính sách điều chỉnh giá</h3>
            <p className="text-sm font-medium text-slate-500">Bật/tắt các hệ số ảnh hưởng đến giá vé</p>
          </div>
        </div>
        <div className="space-y-3">
          {modifiers.map(m => (
            <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100/50 hover:bg-white hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleModifier(m.id)}
                  className={cx(
                    "w-12 h-7 rounded-full transition-all duration-300 relative",
                    m.active ? 'bg-blue-600' : 'bg-slate-200'
                  )}
                >
                  <div className={cx(
                    "w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-300",
                    m.active ? 'left-6' : 'left-1'
                  )} />
                </button>
                <div>
                  <div className="text-sm font-bold text-slate-900">{m.name}</div>
                  <div className="text-[11px] font-bold text-slate-400">
                    Hệ số: ×{m.modifier} ({m.modifier < 1 ? `Giảm ${Math.round((1 - m.modifier) * 100)}%` : `Tăng ${Math.round((m.modifier - 1) * 100)}%`})
                  </div>
                </div>
              </div>
              <span className={cx(
                "text-[11px] font-black px-3 py-1 rounded-lg uppercase",
                m.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
              )}>
                {m.active ? 'Đang áp dụng' : 'Tắt'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
