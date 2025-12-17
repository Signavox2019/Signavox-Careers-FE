import { useState, useEffect } from 'react';

const emptyEducation = {
  programOrDegree: '',
  branchOrSpecialization: '',
  institution: '',
  boardOrUniversity: '',
  passedYear: '',
  percentageOrCGPA: ''
};

const fieldConfig = [
  { name: 'programOrDegree', label: 'Program / Degree', placeholder: 'e.g., BTech' },
  { name: 'branchOrSpecialization', label: 'Branch / Specialization', placeholder: 'e.g., Computer Science' },
  { name: 'institution', label: 'Institution', placeholder: 'e.g., MIT' },
  { name: 'boardOrUniversity', label: 'Board / University', placeholder: 'e.g., Stanford University' },
  { name: 'passedYear', label: 'Passed Year', placeholder: 'e.g., 2025', type: 'number' },
  { name: 'percentageOrCGPA', label: 'Percentage / CGPA', placeholder: 'e.g., 9.1 CGPA' }
];

const EducationModal = ({ isOpen, onClose, onSave, initialData, loading }) => {
  const [formData, setFormData] = useState(emptyEducation);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...emptyEducation,
        ...initialData
      });
      setFormErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.programOrDegree?.trim()) {
      errors.programOrDegree = 'Program / Degree is required';
    }
    if (!formData.institution?.trim()) {
      errors.institution = 'Institution is required';
    }
    if (!formData.boardOrUniversity?.trim()) {
      errors.boardOrUniversity = 'Board / University is required';
    }
    if (!formData.passedYear) {
      errors.passedYear = 'Passed year is required';
    } else if (!/^\d{4}$/.test(String(formData.passedYear))) {
      errors.passedYear = 'Enter a valid year (YYYY)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[10010] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md"
        onClick={loading ? undefined : onClose}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white flex items-center justify-between">
          <div>
            <p className="uppercase text-xs tracking-[0.4em] text-white/70">
              {initialData?._id ? 'Update entry' : 'Add new entry'}
            </p>
            <h3 className="text-2xl font-bold">{initialData?._id ? 'Edit Education' : 'Add Education'}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition disabled:opacity-40"
            aria-label="Close education modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fieldConfig.map(({ name, label, placeholder, type = 'text' }) => (
              <div key={name} className="space-y-2">
                <label htmlFor={name} className="text-sm font-medium text-slate-600">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name] ?? ''}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`w-full px-4 py-3 rounded-2xl border shadow-sm bg-white/80 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition ${
                    formErrors[name] ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
                {formErrors[name] && <p className="text-xs text-red-500">{formErrors[name]}</p>}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving…' : (initialData?._id ? 'Update Education' : 'Add Education')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationModal;

