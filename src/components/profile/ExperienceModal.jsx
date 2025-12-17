import { useEffect, useState } from 'react';

const emptyExperience = {
  companyName: '',
  designation: '',
  startDate: '',
  endDate: '',
  responsibilities: ''
};

const ExperienceModal = ({ isOpen, initialData, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState(emptyExperience);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...emptyExperience,
        ...initialData,
        startDate: initialData?.startDate ? initialData.startDate.substring(0, 10) : '',
        endDate: initialData?.endDate ? initialData.endDate.substring(0, 10) : ''
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName?.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.designation?.trim()) {
      newErrors.designation = 'Designation is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[10020] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={loading ? undefined : onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100">
        <div className="px-8 py-6 bg-gradient-to-r from-slate-900 via-indigo-700 to-purple-600 text-white flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">
              {initialData?._id ? 'Update experience' : 'Add experience'}
            </p>
            <h3 className="text-2xl font-bold">{initialData?._id ? 'Edit Experience' : 'Add Experience'}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition disabled:opacity-40"
            aria-label="Close experience modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Company Name</label>
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., TCS"
                className={`w-full px-4 py-3 rounded-2xl border focus:ring-2 focus:ring-indigo-400 ${errors.companyName ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.companyName && <p className="text-xs text-red-500">{errors.companyName}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Designation</label>
              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g., Software Developer"
                className={`w-full px-4 py-3 rounded-2xl border focus:ring-2 focus:ring-indigo-400 ${errors.designation ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.designation && <p className="text-xs text-red-500">{errors.designation}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl border focus:ring-2 focus:ring-indigo-400 ${errors.startDate ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">End Date (optional)</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl border focus:ring-2 focus:ring-indigo-400 ${errors.endDate ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Key Responsibilities</label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your contributions, tech stack, accomplishments…"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

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
              className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-700 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving…' : (initialData?._id ? 'Update Experience' : 'Add Experience')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperienceModal;

