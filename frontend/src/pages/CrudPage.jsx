import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, RefreshCw, Search, AlertCircle } from 'lucide-react';
import { tables } from '../config/tables';
import {
  servicesApi, roomsApi, employeesApi, catalogApi,
  clientsApi, equipmentApi, dealsApi, provisionsApi,
} from '../api/client';
import Modal from '../components/Modal';
import RecordForm from '../components/RecordForm';

const apiMap = {
  services: servicesApi,
  rooms: roomsApi,
  employees: employeesApi,
  catalog: catalogApi,
  clients: clientsApi,
  equipment: equipmentApi,
  deals: dealsApi,
  provisions: provisionsApi,
};

export default function CrudPage() {
  const { resource } = useParams();
  const config = tables[resource];
  const api = apiMap[resource];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchData = useCallback(async () => {
    if (!api) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await api.getAll();
      setData(rows);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!config) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Раздел не найден
      </div>
    );
  }

  const filtered = data.filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return config.fields.some((f) =>
      String(row[f.key] ?? '').toLowerCase().includes(q)
    );
  });

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editing) {
        await api.update(editing[config.idField], formData);
      } else {
        await api.create(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.remove(id);
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const formatValue = (val, field) => {
    if (val == null) return '—';
    if (field?.type === 'number' && typeof val === 'number') {
      return val.toLocaleString('ru-RU');
    }
    if (field?.type === 'date' && val) {
      return new Date(val).toLocaleDateString('ru-RU');
    }
    return String(val);
  };

  const statusColor = (status) => {
    const map = {
      'Свободно': 'bg-emerald-500/20 text-emerald-400',
      'Занято': 'bg-amber-500/20 text-amber-400',
      'Ремонт': 'bg-red-500/20 text-red-400',
      'Доступен': 'bg-emerald-500/20 text-emerald-400',
      'Продан': 'bg-gray-500/20 text-gray-400',
      'В резерве': 'bg-blue-500/20 text-blue-400',
    };
    return map[status] || 'bg-white/10 text-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{config.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {data.length} {data.length === 1 ? 'запись' : data.length < 5 ? 'записи' : 'записей'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="btn-secondary" title="Обновить">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openCreate} className="btn-primary">
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Поиск..."
          className="input-field pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="table-header w-12">#</th>
                {config.fields.map((f) => (
                  <th key={f.key} className="table-header">{f.label}</th>
                ))}
                <th className="table-header text-right w-28">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={config.fields.length + 2} className="table-cell text-center text-gray-500 py-12">
                    Загрузка...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={config.fields.length + 2} className="table-cell text-center text-gray-500 py-12">
                    {search ? 'Ничего не найдено' : 'Нет данных. Добавьте первую запись.'}
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row[config.idField]} className="hover:bg-white/[0.02] transition-colors">
                    <td className="table-cell text-gray-500 font-mono text-xs">
                      {row[config.idField]}
                    </td>
                    {config.fields.map((f) => (
                      <td key={f.key} className="table-cell">
                        {f.key === 'Статус' ? (
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(row[f.key])}`}>
                            {row[f.key]}
                          </span>
                        ) : (
                          <span className="line-clamp-2">{formatValue(row[f.key], f)}</span>
                        )}
                      </td>
                    ))}
                    <td className="table-cell">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(row)}
                          className="p-2 rounded-lg text-gray-400 hover:text-studio-300 hover:bg-studio-500/10 transition"
                          title="Редактировать"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(row)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Редактировать — ${config.title}` : `Новая запись — ${config.title}`}
      >
        <RecordForm
          fields={config.fields}
          initial={editing || {}}
          onSubmit={handleSave}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Подтверждение удаления"
      >
        <p className="text-gray-300 mb-6">
          Вы уверены, что хотите удалить эту запись?
          {deleteConfirm && (
            <span className="block mt-2 text-sm text-gray-500 font-mono">
              ID: {deleteConfirm[config.idField]}
            </span>
          )}
        </p>
        <div className="flex gap-3">
          <button
            className="btn-danger flex-1"
            onClick={() => handleDelete(deleteConfirm[config.idField])}
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </button>
          <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>
            Отмена
          </button>
        </div>
      </Modal>
    </div>
  );
}
