import { useState, useEffect } from 'react';

const SOCIAL_MEDIA_OPTIONS = [
  { value: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { value: 'github', label: 'GitHub', icon: 'github' },
  { value: 'twitter', label: 'Twitter', icon: 'twitter' },
  { value: 'facebook', label: 'Facebook', icon: 'facebook' },
  { value: 'instagram', label: 'Instagram', icon: 'instagram' },
  { value: 'youtube', label: 'YouTube', icon: 'youtube' },
  { value: 'portfolio', label: 'Portfolio/Website', icon: 'portfolio' },
  { value: 'other', label: 'Other', icon: 'other' }
];

const getSocialIcon = (type) => {
  const icons = {
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    portfolio: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    other: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  };
  return icons[type] || icons.other;
};

const EditPersonalDetailsModal = ({ isOpen, onClose, profileData, onSave }) => {
  const [formData, setFormData] = useState({
    permanentAddress: '',
    currentAddress: '',
    socialLinks: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && profileData) {
      // Convert socialLinks object to array format
      const socialLinksArray = [];
      if (profileData.socialLinks) {
        Object.entries(profileData.socialLinks).forEach(([type, url]) => {
          if (url) {
            socialLinksArray.push({ type, url });
          }
        });
      }
      // If no social links, add one empty entry
      if (socialLinksArray.length === 0) {
        socialLinksArray.push({ type: '', url: '' });
      }

      setFormData({
        permanentAddress: profileData.permanentAddress || '',
        currentAddress: profileData.currentAddress || '',
        socialLinks: socialLinksArray
      });
      setError(null);
    }
  }, [isOpen, profileData]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (index, field, value) => {
    setFormData(prev => {
      const newLinks = [...prev.socialLinks];
      const updatedLink = { ...newLinks[index], [field]: value };
      newLinks[index] = updatedLink;
      
      // Validate for duplicate types when type is changed
      if (field === 'type' && value) {
        const duplicateIndex = newLinks.findIndex((link, i) => i !== index && link.type === value && link.type);
        if (duplicateIndex !== -1) {
          setError(`This social media type is already added. Please select a different one.`);
          return prev; // Don't update if duplicate
        }
      }
      
      // Clear error if validation passes
      setError(null);
      
      return { ...prev, socialLinks: newLinks };
    });
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { type: '', url: '' }]
    }));
  };

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate for duplicate social media types
      const types = formData.socialLinks
        .filter(link => link.type && link.url)
        .map(link => link.type);
      const uniqueTypes = new Set(types);
      
      if (types.length !== uniqueTypes.size) {
        setError('Duplicate social media types are not allowed. Please remove duplicates.');
        setLoading(false);
        return;
      }

      // Validate for duplicate URLs
      const urls = formData.socialLinks
        .filter(link => link.type && link.url)
        .map(link => link.url.trim().toLowerCase());
      const uniqueUrls = new Set(urls);
      
      if (urls.length !== uniqueUrls.size) {
        setError('Duplicate URLs are not allowed. Please use different links.');
        setLoading(false);
        return;
      }

      // Convert socialLinks array back to object format for API
      const socialLinksObj = {};
      formData.socialLinks.forEach(link => {
        if (link.type && link.url) {
          socialLinksObj[link.type] = link.url.trim();
        }
      });

      const payload = {
        permanentAddress: formData.permanentAddress,
        currentAddress: formData.currentAddress,
        socialLinks: socialLinksObj
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update personal details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Get read-only personal info
  const nameParts = (profileData?.name || '').split(' ');
  const firstName = profileData?.firstName || nameParts[0] || '';
  const lastName = profileData?.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '') || '';
  const gender = profileData?.gender || '';
  const DOB = profileData?.DOB ? profileData.DOB.split('T')[0] : '';
  const phoneNumber = profileData?.phoneNumber || '';

  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-indigo-500/20 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 border-b border-indigo-200 z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Edit Personal Details</h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/20 rounded-lg"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}


            {/* Address Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Address</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Address
                  </label>
                  <textarea
                    id="currentAddress"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleAddressChange}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                    placeholder="Enter current address"
                  />
                </div>
                <div>
                  <label htmlFor="permanentAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Permanent Address
                  </label>
                  <textarea
                    id="permanentAddress"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleAddressChange}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                    placeholder="Enter permanent address"
                  />
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Social Links</h4>
              <div className="space-y-4">
                {formData.socialLinks.map((link, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Social Media Type
                            </label>
                            <select
                              value={link.type}
                              onChange={(e) => handleSocialLinkChange(index, 'type', e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                            >
                              <option value="">Select type</option>
                              {SOCIAL_MEDIA_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </div>
                          {link.type && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL
                              </label>
                              <div className="flex items-center gap-2">
                                <div className="flex-shrink-0 p-2 bg-white border border-gray-300 rounded-lg text-gray-600">
                                  {getSocialIcon(link.type)}
                                </div>
                                <input
                                  type="url"
                                  value={link.url}
                                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                  placeholder={`Enter ${SOCIAL_MEDIA_OPTIONS.find(o => o.value === link.type)?.label || 'social media'} URL`}
                                />
                              </div>
                            </div>
                          )}
                          {!link.type && (
                            <div className="md:col-span-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL
                              </label>
                              <div className="px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-400 text-sm">
                                Select social media type first
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {formData.socialLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-7"
                          aria-label="Remove social link"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="w-full px-4 py-2.5 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 border border-indigo-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Social Link
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPersonalDetailsModal;
