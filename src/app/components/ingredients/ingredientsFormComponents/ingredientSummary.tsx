type IngredientSummaryProps = {
  quantity: number;
  unit: string;
  name: string;
  price: number;
};

const IngredientSummary = ({ quantity, unit, name, price }: IngredientSummaryProps) => (
  <div className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 mt-3 text-center text-gray-600">
    <p className="text-lg">
      {quantity} {unit} of <span className="font-semibold text-gray-800">{name}</span> cost <span className="font-semibold text-red-500">{price}€</span>
    </p>
  </div>
);

// --- components/ingredient-form/FormErrors.tsx ---
type FormErrorsProps = {
  errors: string[];
};

export const FormErrors = ({ errors }: FormErrorsProps) => (
  <div className="mt-2 text-center">
    {errors.length > 0 && errors.map((err) => <p key={err} className='text-red-500'> {err} </p>)}
  </div>
);

export default IngredientSummary