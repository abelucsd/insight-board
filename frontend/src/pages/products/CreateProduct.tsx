import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, CreateProductInput } from '../../schemas/productSchema';
import { createProduct } from '../../api/productAPI';

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema)
  });

  const onSubmit = async (data: CreateProductInput) => {
    try {
      await createProduct(data);
      alert('Product created!');  
      reset();     
    } catch (error) {
      alert('Error creating product');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label className="block font-medium">Name</label>
        <input {...register('name')} className="input w-full"/>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Price</label>
        <input type="number" {...register('price')} className="input w-full" />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea {...register('description')} className="input w-full h-24" />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn btn-primary">
        {isSubmitting ? 'Creating...' : 'Create Product'}
      </button>

    </form>
  );
};

export default CreateProduct;