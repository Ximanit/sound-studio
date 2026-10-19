import { useState, useEffect } from 'react';

export default function RecordForm({ fields, initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    const defaults = {};
    fields.forEach((f) => {
      defaults[f.key] = initial[f.key] ?? (f.type === 'number' ? '' : '');
    });
    setForm(defaults);
  }, [fields, initial]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {};
    fields.forEach((f) => {
      let val = form[f.key];
      if (f.type === 'number') val = val === '' ? null : Number(val);
      payload[f.key] = val;
    });
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            {field.label}
            {field.required && <span className="text-studio-400 ml-0.5">*</span>}
          </label>

          {field.type === 'select' ? (
            <select
              className="input-field"
              value={form[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              required={field.required}
            >
              <option value="">Выберите...</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              className="input-field min-h-[80px] resize-y"
              value={form[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              required={field.required}
            />
          ) : (
            <input
              type={field.type}
              className="input-field"
              value={form[field.key] ?? ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              required={field.required}
            />
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1" disabled={loading}>
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
}
