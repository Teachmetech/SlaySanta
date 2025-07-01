import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button Component', () => {
    it('renders with correct text', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('applies primary variant styles by default', () => {
        render(<Button>Primary Button</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('btn-primary')
    })

    it('applies secondary variant styles', () => {
        render(<Button variant="secondary">Secondary Button</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('btn-secondary')
    })

    it('applies outline variant styles', () => {
        render(<Button variant="outline">Outline Button</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('btn-outline')
    })

    it('handles click events', async () => {
        const handleClick = vi.fn()
        const user = userEvent.setup()

        render(<Button onClick={handleClick}>Clickable</Button>)

        await user.click(screen.getByRole('button'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled Button</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
        expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
    })

    it('applies correct size classes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>)
        expect(screen.getByRole('button')).toHaveClass('h-8', 'px-3', 'text-sm')

        rerender(<Button size="md">Medium</Button>)
        expect(screen.getByRole('button')).toHaveClass('h-10', 'px-4', 'py-2')

        rerender(<Button size="lg">Large</Button>)
        expect(screen.getByRole('button')).toHaveClass('h-12', 'px-6', 'text-lg')
    })

    it('applies custom className along with default classes', () => {
        render(<Button className="custom-class">Custom</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('custom-class')
        expect(button).toHaveClass('btn-primary') // default variant
    })

    it('forwards ref correctly', () => {
        const ref = vi.fn()
        render(<Button ref={ref}>Button with ref</Button>)
        expect(ref).toHaveBeenCalled()
    })
}) 