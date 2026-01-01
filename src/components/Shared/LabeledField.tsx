import type { LabeledFieldProps } from '../../types';
import './LabeledField.css';

export default function LabeledField({
  label,
  required = false,
  helperText,
  children,
}: LabeledFieldProps) {
  return (
    <div className="labeled-field">
      <label className="field-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <div className="field-input">{children}</div>
      {helperText && <div className="field-helper-text">{helperText}</div>}
    </div>
  );
}
