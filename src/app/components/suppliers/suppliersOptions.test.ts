import { DeliveryTimeSchema, SupplierSchema } from '@/shemas/recipe'
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS } from '@/app/constants/data'

describe('Suppliers Delivery and Payment options validation', () => {
  it('validates all DELIVERY_OPTIONS values against DeliveryTimeSchema', () => {
    for (const option of DELIVERY_OPTIONS) {
      const parsed = DeliveryTimeSchema.safeParse(option.value)
      expect(parsed.success).toBe(true)
    }
  })

  it('validates all PAYMENT_OPTIONS values against SupplierSchema financialData.paymentTerms', () => {
    const paymentTermsSchema = SupplierSchema.shape.financialData.shape.paymentTerms
    for (const option of PAYMENT_OPTIONS) {
      const parsed = paymentTermsSchema.safeParse(option.value)
      expect(parsed.success).toBe(true)
    }
  })

  it('validates a complete supplier payload with each delivery and payment option', () => {
    for (const dOption of DELIVERY_OPTIONS) {
      for (const pOption of PAYMENT_OPTIONS) {
        const payload = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Supplier',
          userId: 'user-123',
          deliveryTime: dOption.value,
          financialData: {
            paymentTerms: pOption.value,
            vatNumber: 'EL123456789',
          },
          category: [],
          isActive: true,
        }

        const parsed = SupplierSchema.safeParse(payload)
        expect(parsed.success).toBe(true)
      }
    }
  })
})
