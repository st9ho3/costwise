import { renderHook, act } from '@testing-library/react';
import { useIngredientForm } from './useIngredientsForm';
import * as services from '../services/services';

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
  sendIngredient: jest.fn().mockResolvedValue({ success: true, message: 'Ingredient successfully created!' }),
  updateIngredient: jest.fn().mockResolvedValue({ success: true, message: 'Ingredient successfully updated!' }),
}));

jest.mock('./useHelpers', () => () => ({
  raiseNotification: jest.fn(),
}));

describe('useIngredientForm', () => {
  const supplierId = '55555555-5555-5555-5555-555555555555';
  const supplierOptions = [
    { id: supplierId, name: 'Dairy Supplier' },
  ];
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fails with human-readable error when submitting create form without supplier', async () => {
    const { result } = renderHook(() =>
      useIngredientForm({
        mode: 'create',
        ingredient: undefined,
        userId,
        supplierOptions,
      })
    );

    act(() => {
      result.current.setValue('name', 'Pecorino Romano');
      result.current.setValue('unit', 'kg');
      result.current.setValue('unitPrice', 12.4);
      result.current.setValue('quantity', 1);
    });

    await act(async () => {
      await result.current.handleSubmit(result.current.onSubmit)();
    });

    expect(services.sendIngredient).not.toHaveBeenCalled();
    expect(result.current.error).toContain('Add at least one supplier');
  });

  it('successfully creates an ingredient with supplier payload when supplier is selected', async () => {
    const { result } = renderHook(() =>
      useIngredientForm({
        mode: 'create',
        ingredient: undefined,
        userId,
        supplierOptions,
      })
    );

    act(() => {
      result.current.setValue('name', 'Pecorino Romano');
      result.current.setValue('unit', 'kg');
      result.current.setValue('unitPrice', 12.4);
      result.current.setValue('quantity', 1);
      result.current.selectSupplier(supplierId);
    });

    await act(async () => {
      await result.current.handleSubmit(result.current.onSubmit)();
    });

    expect(services.sendIngredient).toHaveBeenCalledTimes(1);
    const sentPayload = (services.sendIngredient as jest.Mock).mock.calls[0][0];
    expect(sentPayload.name).toBe('Pecorino Romano');
    expect(sentPayload.unit).toBe('g');
    expect(sentPayload.unitPrice).toBe(0.0124);
    expect(sentPayload.suppliers).toEqual([
      {
        suppliersId: supplierId,
        unit: 'kg',
        quantity: 1,
        price: 12.4,
        isActive: true,
      },
    ]);
    expect(mockReplace).toHaveBeenCalledWith('/ingredients');
  });

  it('successfully updates an ingredient with supplier payload in edit mode', async () => {
    const existingIngredient = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Old Pecorino',
      unit: 'g' as const,
      unitPrice: 0.01,
      quantity: 1,
      usage: '3',
      userId,
      icon: '',
      category: '80662af1-1943-4168-8549-ef721b0e9f54' as const,
      categoryName: 'Dairy & Alternatives' as const,
      suppliers: [
        {
          suppliersId: supplierId,
          unit: 'kg' as const,
          quantity: 1,
          price: 10,
          isActive: true,
        },
      ],
    };

    const { result } = renderHook(() =>
      useIngredientForm({
        mode: 'edit',
        ingredient: existingIngredient,
        userId,
        supplierOptions,
      })
    );

    act(() => {
      result.current.setValue('name', 'Updated Pecorino');
      result.current.setValue('unit', 'kg');
      result.current.setValue('unitPrice', 15);
      result.current.setValue('quantity', 2);
    });

    await act(async () => {
      await result.current.handleSubmit(result.current.onSubmit)();
    });

    expect(services.updateIngredient).toHaveBeenCalledTimes(1);
    const sentPayload = (services.updateIngredient as jest.Mock).mock.calls[0][0];
    expect(sentPayload.name).toBe('Updated Pecorino');
    expect(sentPayload.suppliers).toEqual([
      {
        suppliersId: supplierId,
        unit: 'kg',
        quantity: 2,
        price: 15,
        isActive: true,
      },
    ]);
  });
});
