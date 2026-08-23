import { renderHook, act } from '@testing-library/react';
import useRecipeForm from './useRecipeForm';
import * as services from '../services/services';
import { RecipeIngredients } from '@costwise/shared/recipe';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
  }),
}));

jest.mock('../services/services', () => ({
  sendRecipe: jest.fn().mockResolvedValue({ success: true, message: 'Recipe created' }),
  sendRecipeToUpdate: jest.fn().mockResolvedValue({ success: true, message: 'Recipe updated' }),
}));

jest.mock('./useHelpers', () => () => ({
  raiseNotification: jest.fn(),
}));

jest.mock('./useFileUpload', () => ({
  useFileUpload: () => ({
    handleFileUpload: jest.fn().mockResolvedValue('https://example.com/img.jpg'),
    error: null,
  }),
}));

describe('useRecipeForm', () => {
  const userId = 'user-123';
  const sampleIngredients: RecipeIngredients[] = [
    {
      recipeId: 'rec-1',
      ingredientId: 'ing-1',
      name: 'Pecorino',
      unit: 'g',
      unitPrice: 0.0125,
      quantity: 100, // 100g * 0.0125 = €1.25
    },
    {
      recipeId: 'rec-1',
      ingredientId: 'ing-2',
      name: 'Guanciale',
      unit: 'kg',
      unitPrice: 0.02, // 0.1kg * 1000 * 0.02 = €2.00
      quantity: 0.1,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('persists calculated totalCost and tax in create mode', async () => {
    const { result } = renderHook(() =>
      useRecipeForm({
        mode: 'create',
        recipe: undefined,
        recipeIngredients: [],
        ingredients: [],
        userId,
      })
    );

    act(() => {
      result.current.setValue('title', 'Carbonara');
      result.current.setValue('category', 'main');
      result.current.setValue('sellingPrice', 10);
      result.current.setValue('tax', 0.13);
      // Add ingredients to plate
      result.current.handleAddIngredient(sampleIngredients[0]);
      result.current.handleAddIngredient(sampleIngredients[1]);
    });

    await act(async () => {
      await result.current.handleSubmit(result.current.onSubmit)();
    });

    expect(services.sendRecipe).toHaveBeenCalledTimes(1);
    const sentData = (services.sendRecipe as jest.Mock).mock.calls[0][0];
    expect(sentData.title).toBe('Carbonara');
    expect(sentData.totalCost).toBe(3.25);
    expect(sentData.tax).toBe(0.13);
    expect(sentData.foodCost).toBeCloseTo(32.5);
  });

  it('persists updated VAT and recalculated values in edit mode', async () => {
    const existingRecipe = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Old Carbonara',
      totalCost: 3.25,
      createdBy: userId,
      dateCreated: new Date(),
      category: 'main' as const,
      tax: 0.13,
      imgPath: 'https://example.com/img.jpg',
      sellingPrice: 10,
      profitMargin: 54.5,
      foodCost: 32.5,
      userId,
    };

    const { result } = renderHook(() =>
      useRecipeForm({
        mode: 'edit',
        recipe: existingRecipe,
        recipeIngredients: sampleIngredients,
        ingredients: [],
        userId,
      })
    );

    act(() => {
      result.current.setValue('tax', 0.24);
      result.current.setValue('sellingPrice', 12);
    });

    await act(async () => {
      await result.current.handleSubmit(result.current.onSubmit)();
    });

    expect(services.sendRecipeToUpdate).toHaveBeenCalledTimes(1);
    const updatedPayload = (services.sendRecipeToUpdate as jest.Mock).mock.calls[0][0];
    expect(updatedPayload.tax).toBe(0.24);
    expect(updatedPayload.totalCost).toBe(3.25);
    expect(updatedPayload.sellingPrice).toBe(12);
  });
});
