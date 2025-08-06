import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, CreateProductInput } from '../../schemas/productSchema';
import { createProduct } from '../../api/productAPI';
import FormCard from '../../components/FormCard';

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
    <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto flex flex-col gap-8 h-screen py-8 md:p-8 px-2">
      <h2>Add Product</h2>            
      <FormCard>
        <div>
          <label className="block font-medium">Id</label>
          <input {...register('id')} className="input input-box w-full my-2"/>
          {errors.id && <p className="text-red-500">{errors.id.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Name</label>
          <input {...register('name')} className="input input-box w-full my-2"/>
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <input {...register('category')} className="input input-box w-full my-2"/>
          {errors.category && <p className="text-red-500">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Price</label>
          <input type="number" {...register('price')} className="input input-box w-full my-2"/>
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Sale Price</label>
          <input type="number" {...register('salePrice')} className="input input-box w-full my-2"/>
          {errors.salePrice && <p className="text-red-500">{errors.salePrice.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Cost</label>
          <input type="number" {...register('cost')} className="input input-box w-full my-2"/>
          {errors.cost && <p className="text-red-500">{errors.cost.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea {...register('description')} className="input input-box w-full h-24 my-2"/>
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </button>
      </FormCard>
    </form>
  );
};

export default CreateProduct;