import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../../../../../shared/components/ui/Input';

describe('Input Component', () => {
  it('renders input with label', () => {
    render(
      <Input
        label="Test Label"
        id="test-input"
        name="test"
        type="text"
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders input without label', () => {
    render(
      <Input
        id="test-input"
        name="test"
        type="text"
        placeholder="Enter text"
      />
    );

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    
    render(
      <Input
        id="test-input"
        name="test"
        type="text"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        value: 'test value'
      })
    }));
  });

  it('displays error message', () => {
    render(
      <Input
        label="Test Input"
        id="test-input"
        name="test"
        type="text"
        error="This field is required"
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('applies disabled state', () => {
    render(
      <Input
        label="Test Input"
        id="test-input"
        name="test"
        type="text"
        disabled
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies required attribute', () => {
    render(
      <Input
        label="Test Input"
        id="test-input"
        name="test"
        type="text"
        required
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('renders different input types', () => {
    const { rerender } = render(
      <Input
        id="email-input"
        name="email"
        type="email"
      />
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(
      <Input
        id="password-input"
        name="password"
        type="password"
      />
    );

    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');

    rerender(
      <Input
        id="number-input"
        name="number"
        type="number"
      />
    );

    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(
      <Input
        id="test-input"
        name="test"
        type="text"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );

    const input = screen.getByRole('textbox');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalled();

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <Input
        id="test-input"
        name="test"
        type="text"
        className="custom-class"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('renders with help text', () => {
    render(
      <Input
        label="Test Input"
        id="test-input"
        name="test"
        type="text"
        helpText="This is help text"
      />
    );

    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  it('handles textarea variant', () => {
    render(
      <Input
        label="Test Textarea"
        id="test-textarea"
        name="test"
        type="textarea"
        rows={4}
      />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('handles select variant', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];

    render(
      <Input
        label="Test Select"
        id="test-select"
        name="test"
        type="select"
        options={options}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select.tagName).toBe('SELECT');
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('handles file input variant', () => {
    const handleFileChange = vi.fn();

    render(
      <Input
        label="Test File"
        id="test-file"
        name="test"
        type="file"
        accept=".jpg,.png"
        onChange={handleFileChange}
      />
    );

    const fileInput = screen.getByLabelText('Test File');
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', '.jpg,.png');
  });

  it('handles checkbox variant', () => {
    const handleChange = vi.fn();

    render(
      <Input
        label="Test Checkbox"
        id="test-checkbox"
        name="test"
        type="checkbox"
        checked={false}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });

  it('handles radio variant', () => {
    const handleChange = vi.fn();

    render(
      <div>
        <Input
          label="Option 1"
          id="radio1"
          name="test-radio"
          type="radio"
          value="option1"
          onChange={handleChange}
        />
        <Input
          label="Option 2"
          id="radio2"
          name="test-radio"
          type="radio"
          value="option2"
          onChange={handleChange}
        />
      </div>
    );

    const radio1 = screen.getByLabelText('Option 1');
    const radio2 = screen.getByLabelText('Option 2');

    expect(radio1).toHaveAttribute('type', 'radio');
    expect(radio2).toHaveAttribute('type', 'radio');
    expect(radio1).toHaveAttribute('name', 'test-radio');
    expect(radio2).toHaveAttribute('name', 'test-radio');

    fireEvent.click(radio1);
    expect(handleChange).toHaveBeenCalled();
  });
});
