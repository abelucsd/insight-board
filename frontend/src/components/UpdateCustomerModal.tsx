import { Dialog, DialogTitle } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { Customer } from '../types/customer';

type UpdateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onUpdate: (id: string, updatedCustomer: Partial<Customer>) => void;
};

export function UpdateCustomerModal({ isOpen, onClose, customer, onUpdate }: UpdateModalProps) {
  const [formData, setFormData] = useState<Partial<Customer>>({
    id: '',
    name: '',
    number: 9999999999,
    address: '',
    email: '',
  });

  // When product changes (open modal with new product), update form data
  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.id,
        name: customer.name,
        number: customer.number,
        address: customer.address,
        email: customer.email,
      });
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (customer) {
      onUpdate(customer._id, formData);
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
              Id:
              <input
                type="text"
                name="id"
                value={formData.id || ''}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </label>

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
              Number:
              <input
                type="number"
                name="number"
                value={formData.number || ''}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </label>

            <label className="block mb-2">
              Address:
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </label>

            <label className="block mb-2">
              Email:
              <input
                type="text"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
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
