import { useEffect, useState } from 'react';

const emptyCertification = {
  certificationName: '',
  issuedBy: '',
  certificateUrl: '',
  description: '',
  issuedDate: '',
  expiryDate: ''
};

const CertificationModal = ({ isOpen, initialData, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState(emptyCertification);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...emptyCertification,
        ...initialData,
        issuedDate: initialData?.issuedDate ? initialData.issuedDate.substring(0, 10) : '',
        expiryDate: initialData?.expiryDate ? initialData.expiryDate.substring(0, 10) : ''
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.certificationName?.trim()) {
      newErrors.certificationName = 'Certification name is required';
    }
    if (!formData.issuedBy?.trim()) {
      newErrors.issuedBy = 'Issuer is required';
    }
    if (formData.certificateUrl && !/^https?:\/\/.+/i.test(formData.certificateUrl)) {
      newErrors.certificateUrl = 'Enter a valid URL (must include http/https)';
    }
    if (!formData.issuedDate) {
      newErrors.issuedDate = 'Issued date is required';
    }
    if (formData.expiryDate && formData.issuedDate && formData.expiryDate < formData.issuedDate) {
      newErrors.expiryDate = 'Expiry date cannot be before issued date';
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
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100">
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">
              {initialData?._id ? 'Update certification' : 'Add certification'}
            </p>
            <h3 className="text-2xl font-bold">{initialData?._id ? 'Edit Certification' : 'Add Certification'}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition disabled:opacity-40"
            aria-label="Close certification modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Certification Name</label>
              <input
                name="certificationName"
                value={formData.certificationName}
                onChange={handleChange}
                placeholder="e.g., MERN Stack"
                className={`w-full px-4 py-3 rounded-2xl border focus:ring-2 focus:ring-indigo-400 ${errors.certificationName ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.certificationName && <p className="text-xs text-red-500">{errors.certificationName}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Issued By</label>
              <input
                name="issuedBy"
                value={formData.issuedBy}
                onChange={handleChange}
                placeholder="e.g., Coursera"
                className={`w-full px-4 py-3 rounded-2xl border focus:ring-2 focus:ring-indigo-400 ${errors.issuedBy ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.issuedBy && <p className="text-xs text-red-500">{errors.issuedBy}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Certificate URL</label>
            <input
              name="certificateUrl"
              value={formData.certificateUrl}
              onChange={handleChange}
              placeholder="https://..."
              className={`w-full px-4 py-3 rounded-2xl border focus:ring-2 focus:ring-indigo-400 ${errors.certificateUrl ? 'border-red-400' : 'border-slate-200'}`}
            />
            {errors.certificateUrl && <p className="text-xs text-red-500">{errors.certificateUrl}</p>}
          </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Issued Date</label>
              <input
                type="date"
                name="issuedDate"
                value={formData.issuedDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl border focus:ring-2 focus:ring-indigo-400 ${errors.issuedDate ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.issuedDate && <p className="text-xs text-red-500">{errors.issuedDate}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Expiry Date (optional)</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl border focus:ring-2 focus:ring-indigo-400 ${errors.expiryDate ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what you learned, key skills, credential details…"
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
              className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving…' : (initialData?._id ? 'Update Certification' : 'Add Certification')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationModal;

