import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { Product } from '../types/products';

type UpdateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate: (id: string, updatedProduct: Partial<Product>) => void;
};

export default function UpdateProductModal({ isOpen, onClose, product, onUpdate }: UpdateModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
  });

  // When product changes (open modal with new product), update form data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (product) {
      onUpdate(product._id, formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">      

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded max-w-md w-full p-6">
          <DialogTitle className="text-lg font-bold mb-4">Update Product</DialogTitle>

          <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </label>

            <label className="block mb-2">
              Price:
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price?.toString() || ''}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </label>

            <label className="block mb-4">
              Description:
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                rows={3}
              />
            </label>

            <div className="flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
