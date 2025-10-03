import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <Modal open title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal open={false} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal open title="Test Modal" onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal open title="Test Modal" onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    );

    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal open title="Test Modal" onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    );

    const modalContent = screen.getByText('Modal content');
    fireEvent.click(modalContent);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal open title="Test Modal" onClose={handleClose}>
        <p>Modal content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders with custom size', () => {
    render(
      <Modal open title="Test Modal" size="lg">
        <p>Modal content</p>
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('max-w-2xl');
  });

  it('renders without close button when closeable is false', () => {
    render(
      <Modal open title="Test Modal" closeable={false}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  it('renders with custom footer', () => {
    const customFooter = (
      <div>
        <button>Custom Action</button>
      </div>
    );

    render(
      <Modal open title="Test Modal" footer={customFooter}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Modal open title="Test Modal" className="custom-modal">
        <p>Modal content</p>
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('custom-modal');
  });

  it('traps focus within modal', () => {
    render(
      <Modal open title="Test Modal">
        <input placeholder="First input" />
        <input placeholder="Second input" />
        <button>Submit</button>
      </Modal>
    );

    const firstInput = screen.getByPlaceholderText('First input');
    const secondInput = screen.getByPlaceholderText('Second input');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Focus should start on the first focusable element
    expect(firstInput).toHaveFocus();

    // Tab should move to next element
    fireEvent.keyDown(firstInput, { key: 'Tab' });
    expect(secondInput).toHaveFocus();

    // Tab should move to next element
    fireEvent.keyDown(secondInput, { key: 'Tab' });
    expect(submitButton).toHaveFocus();

    // Tab should cycle back to first element
    fireEvent.keyDown(submitButton, { key: 'Tab' });
    expect(firstInput).toHaveFocus();
  });

  it('renders with loading state', () => {
    render(
      <Modal open title="Test Modal" loading>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
