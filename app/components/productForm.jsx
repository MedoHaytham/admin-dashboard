import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { X, Plus } from 'lucide-react';
import { useAddProductMutation, useAddCategoryMutation, useDeleteCategoryMutation } from '../features/productsSlice';

const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  brand: '',
  images: [''],
};

const EMPTY_CATEGORY_FORM = { name: '' };

function AddProductForm({ categories, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // RTK Query mutations
  const [addProduct, { isLoading: isSubmitting }] = useAddProductMutation();
  const [addCategory, { isLoading: isCategorySubmitting }] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Add category modal state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY_FORM);
  const [categoryError, setCategoryError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'price' || name === 'stock') && !/^\d*\.?\d*$/.test(value)) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const onImageChange = (index, value) => {
    setForm((prev) => {
      const images = [...prev.images];
      images[index] = value;
      return { ...prev, images };
    });
  };

  const addImageField = () => {
    if (form.images.length >= 5) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.price) errs.price = 'Price is required';
    if (!form.stock) errs.stock = 'Stock is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        brand: form.brand,
        images: form.images.filter((img) => img.trim() !== ''),
      };

      await addProduct(payload).unwrap();
      toast.success('Product added successfully');
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || 'Error adding product');
    }
  };

  // Add category submit
  const categorySubmitHandler = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      setCategoryError('Category name is required');
      return;
    }
    try {
      const res = await addCategory({ 
        name: categoryForm.name,
        slug: categoryForm.name.toLowerCase().replace(/\s+/g, '-')
      }).unwrap();
      toast.success('Category added successfully');
      setForm((prev) => ({ ...prev, category: res.data._id }));
      setCategoryForm(EMPTY_CATEGORY_FORM);
      setCategoryError('');
      setShowAddCategory(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Error adding category');
    }
  };

  // Delete category
  const deleteCategoryHandler = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deleted successfully');
      if (form.category === id) setForm((prev) => ({ ...prev, category: '' }));
    } catch (error) {
      toast.error(error?.data?.message || 'Error deleting category');
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className='bg-primary border border-border-primary rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-border-primary'>
          <h2 className='text-lg font-semibold text-text-secondary'>Add New Product</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-text-secondary transition-colors'>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className='px-6 py-5 space-y-4'>

          {/* Title */}
          <div className='space-y-1'>
            <label className='text-xs font-medium text-gray-400 uppercase tracking-widest'>Title *</label>
            <input
              name='title'
              value={form.title}
              onChange={onChange}
              placeholder='Product title'
              className='w-full bg-secondary text-text-theme placeholder-gray-500 border border-gray-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all'
            />
            {errors.title && <p className='text-red-400 text-xs'>{errors.title}</p>}
          </div>

          {/* Description */}
          <div className='space-y-1'>
            <label className='text-xs font-medium text-gray-400 uppercase tracking-widest'>Description</label>
            <textarea
              name='description'
              value={form.description}
              onChange={onChange}
              placeholder='Product description'
              rows={3}
              className='w-full bg-secondary text-text-theme placeholder-gray-500 border border-gray-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none'
            />
          </div>

          {/* Category */}
          <div className='space-y-1'>
            <label className='text-xs font-medium text-gray-400 uppercase tracking-widest'>Category *</label>
            <div className='flex items-center gap-2'>
              <select
                name='category'
                value={form.category}
                onChange={onChange}
                className='flex-1 bg-secondary text-text-theme border border-gray-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all'
              >
                <option value=''>Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {/* Add Category Button */}
              <button
                type='button'
                onClick={(e) => { e.stopPropagation(); setShowAddCategory(true); }}
                className='flex items-center justify-center w-10 h-10 bg-secondary border border-gray-700 hover:border-indigo-500/60 text-indigo-400 hover:text-indigo-300 rounded-lg transition-all shrink-0'
                title='Add new category'
              >
                <Plus size={18} />
              </button>
            </div>
            {errors.category && <p className='text-red-400 text-xs'>{errors.category}</p>}
          </div>

          {/* Price & Stock */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-gray-400 uppercase tracking-widest'>Price *</label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>$</span>
                <input
                  name='price'
                  value={form.price}
                  onChange={onChange}
                  placeholder='0.00'
                  className='w-full bg-secondary text-text-theme placeholder-gray-500 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all'
                />
              </div>
              {errors.price && <p className='text-red-400 text-xs'>{errors.price}</p>}
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-medium text-gray-400 uppercase tracking-widest'>Stock *</label>
              <input
                name='stock'
                value={form.stock}
                onChange={onChange}
                placeholder='0'
                className='w-full bg-secondary text-text-theme placeholder-gray-500 border border-gray-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all'
              />
              {errors.stock && <p className='text-red-400 text-xs'>{errors.stock}</p>}
            </div>
          </div>

          {/* Brand */}
          <div className='space-y-1'>
            <label className='text-xs font-medium text-gray-400 uppercase tracking-widest'>Brand</label>
            <input
              name='brand'
              value={form.brand}
              onChange={onChange}
              placeholder='Brand name'
              className='w-full bg-secondary text-text-theme placeholder-gray-500 border border-gray-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all'
            />
          </div>

          {/* Images — max 5 */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <label className='text-xs font-medium text-gray-400 uppercase tracking-widest'>Images</label>
              <span className={`text-xs ${form.images.length >= 5 ? 'text-red-400' : 'text-gray-500'}`}>
                {form.images.length}/5
              </span>
            </div>
            {form.images.map((img, index) => (
              <div key={index} className='flex items-center gap-2'>
                <input
                  value={img}
                  onChange={(e) => onImageChange(index, e.target.value)}
                  placeholder={`Image URL ${index + 1}`}
                  className='flex-1 bg-secondary text-text-theme placeholder-gray-500 border border-gray-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all'
                />
                {form.images.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeImageField(index)}
                    className='text-red-400 hover:text-red-300 transition-colors p-1'
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            {form.images.length < 5 && (
              <button
                type='button'
                onClick={addImageField}
                className='flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors'
              >
                <Plus size={14} /> Add another image
              </button>
            )}
            {form.images.length >= 5 && (
              <p className='text-xs text-red-400'>Maximum 5 images allowed</p>
            )}
          </div>

          {/* Footer */}
          <div className='flex items-center justify-end gap-3 pt-2 border-t border-border-primary'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm text-gray-400 hover:text-text-secondary border border-gray-700 rounded-lg transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg transition-colors'
            >
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      {/* ===== Add Category Mini Modal ===== */}
      {showAddCategory && (
        <div
          className='fixed inset-0 z-60 flex items-center justify-center p-4'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowAddCategory(false)}
        >
          <div
            className='bg-primary border border-border-primary rounded-xl w-full max-w-sm shadow-2xl p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-base font-semibold text-text-secondary'>Manage Categories</h3>
              <button onClick={() => setShowAddCategory(false)} className='text-gray-400 hover:text-text-secondary transition-colors'>
                <X size={18} />
              </button>
            </div>

            {/* Existing categories list with delete */}
            <div className='mb-4 space-y-2 max-h-40 overflow-y-auto'>
              {categories.length === 0 && (
                <p className='text-xs text-gray-500 text-center py-2'>No categories yet</p>
              )}
              {categories.map((cat) => (
                <div key={cat._id} className='flex items-center justify-between bg-secondary rounded-lg px-3 py-2'>
                  <span className='text-sm text-text-theme'>{cat.name}</span>
                  <button
                    type='button'
                    onClick={() => deleteCategoryHandler(cat._id)}
                    className='text-red-400 hover:text-red-300 transition-colors ml-2'
                    title='Delete category'
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className='border-t border-border-primary pt-4'>
              <p className='text-xs font-medium text-gray-400 uppercase tracking-widest mb-3'>Add New Category</p>
              <form onSubmit={categorySubmitHandler} className='space-y-3'>
                <div className='space-y-1'>
                  <input
                    value={categoryForm.name}
                    onChange={(e) => { setCategoryForm({ name: e.target.value }); setCategoryError(''); }}
                    placeholder='e.g. Electronics'
                    className='w-full bg-secondary text-text-theme placeholder-gray-500 border border-gray-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all'
                  />
                  <p className='text-xs text-gray-500 mt-1'>This will be the slug: {categoryForm.name.toLowerCase().replace(/\s+/g, '-')}</p>
                  {categoryError && <p className='text-red-400 text-xs'>{categoryError}</p>}
                </div>
                <div className='flex items-center justify-end gap-3'>
                  <button
                    type='button'
                    onClick={() => setShowAddCategory(false)}
                    className='px-4 py-2 text-sm text-gray-400 hover:text-text-secondary border border-gray-700 rounded-lg transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={isCategorySubmitting}
                    className='px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg transition-colors'
                  >
                    {isCategorySubmitting ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProductForm;