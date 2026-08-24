import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TodayView from './TodayView'

jest.mock('@/app/stores/notificationStore', () => ({
  useNotificationStore: () => jest.fn(),
}))

// Copy and figures from the design mock that shipped as if it were user data.
const FABRICATIONS = [
  'invoice',
  'Metro',
  'Zeta',
  'Kritikos',
  'carbonara',
  'olive oil',
  '1,840',
  '28.4',
  '67.8',
  '€146.00',
  'Athens food-service',
]

const zeroData = {
  firstName: 'Panos',
  totalRecipes: 0,
  totalIngredients: 0,
  totalSuppliers: 0,
  avgFoodCost: 0,
  avgProfitMargin: 0,
  recentRecipes: [],
}

describe('TodayView', () => {
  describe('with no data at all', () => {
    it('never shows counts the user does not have', () => {
      const { container } = render(<TodayView {...zeroData} />)
      const text = container.textContent ?? ''

      // the shipped demo claimed "2 dishes · 11 ingredients · 1 supplier"
      expect(text).not.toMatch(/\b11\b/)
      expect(text).not.toMatch(/\b2 dishes\b/)
      expect(text).not.toMatch(/\b1 supplier\b/)
    })

    it('tells the truth instead of narrating invented work', () => {
      const { container } = render(<TodayView {...zeroData} />)
      const text = (container.textContent ?? '').toLowerCase()

      for (const fabrication of FABRICATIONS) {
        expect(text).not.toContain(fabrication.toLowerCase())
      }
    })

    it('points a new user at something real to do', () => {
      render(<TodayView {...zeroData} />)
      expect(screen.getByRole('link', { name: /add a dish/i })).toBeInTheDocument()
    })
  })

  describe('with real data', () => {
    const withData = {
      ...zeroData,
      totalRecipes: 3,
      totalIngredients: 7,
      totalSuppliers: 2,
      avgFoodCost: 31.5,
      avgProfitMargin: 62.25,
      recentRecipes: [
        {
          id: 'r1',
          title: 'Moussaka',
          sellingPrice: 14.5,
          profitMargin: 62.25,
          totalCost: 5.47,
          category: 'main',
        },
      ],
    }

    it('shows the real figures', () => {
      const { container } = render(<TodayView {...withData} />)
      const text = container.textContent ?? ''

      expect(text).toContain('3')
      expect(text).toContain('7')
      expect(text).toContain('31.5')
      expect(text).toContain('62.3')
      expect(screen.getByText('Moussaka')).toBeInTheDocument()
    })

    it('carries no invented copy or placeholder percentages', () => {
      const { container } = render(<TodayView {...withData} />)
      const text = (container.textContent ?? '').toLowerCase()

      for (const fabrication of FABRICATIONS) {
        expect(text).not.toContain(fabrication.toLowerCase())
      }
    })
  })
})
