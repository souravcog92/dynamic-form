import { useState } from 'react';

export default function DynamicForm({ fields, onSubmit, submitLabel = 'Submit' }) {
  const initial = fields.reduce((acc, f) => {
    acc[f.name] = f.defaultValue ?? '';
    return acc;
  }, {});

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const next = {};
    fields.forEach((f) => {
      const v = values[f.name];
      if (f.required && (v === '' || v === null || v === undefined)) {
        next[f.name] = `${f.label || f.name} is required`;
        return;
      }
      if (v !== '' && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        next[f.name] = 'Enter a valid email address';
      }
      if (v !== '' && f.type === 'number') {
        const n = Number(v);
        if (f.min !== undefined && n < f.min) next[f.name] = `Must be ≥ ${f.min}`;
        if (f.max !== undefined && n > f.max) next[f.name] = `Must be ≤ ${f.max}`;
      }
      if (v !== '' && f.minLength !== undefined && String(v).length < f.minLength) {
        next[f.name] = `Must be at least ${f.minLength} characters`;
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {fields.map((f) => {
        const hasError = Boolean(errors[f.name]);
        const inputClass = `${f.className || 'form-control'}${hasError ? ' is-invalid' : ''}`;
        return (
          <div className="mb-3" key={f.name}>
            <label htmlFor={f.name} className="form-label">
              {f.label}
              {f.required && <span className="text-danger ms-1">*</span>}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              className={inputClass}
              placeholder={f.placeholder}
              value={values[f.name]}
              onChange={(e) => handleChange(f.name, e.target.value)}
              min={f.min}
              max={f.max}
              minLength={f.minLength}
              maxLength={f.maxLength}
              autoComplete={f.autoComplete}
            />
            {f.helpText && !hasError && (
              <div className="form-text">{f.helpText}</div>
            )}
            {hasError && <div className="invalid-feedback">{errors[f.name]}</div>}
          </div>
        );
      })}
      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}
