import { Card, Radio, Slider, Checkbox } from 'antd';
import type { RulesCardProps } from '../../types';
import './RulesCard.css';
import { PasswordType } from '../../types/enums';

export default function RulesCard({
  passwordType,
  onPasswordTypeChange,
  length,
  onLengthChange,
  includeNumbers,
  onIncludeNumbersChange,
  includeSymbols,
  onIncludeSymbolsChange,
  capitalizeFirstLetter,
  onCapitalizeFirstLetterChange,
}: RulesCardProps) {
  const isPin = passwordType === PasswordType.Pin;
  const isMemorable = passwordType === PasswordType.Memorable;
  const isRandom = passwordType === PasswordType.Random;

  return (
    <Card title="Rules" className="rules-card">
      <div className="rules-section">
        <label className="section-label">Password Type</label>
        <Radio.Group
          value={passwordType}
          onChange={(e) => onPasswordTypeChange(e.target.value as PasswordType)}
        >
          <Radio value={PasswordType.Memorable}>Easy to Remember</Radio>
          <Radio value={PasswordType.Random}>Random</Radio>
          <Radio value={PasswordType.Pin}>PIN</Radio>
        </Radio.Group>
      </div>

      <div className="rules-section">
        <label className="section-label">
          {isMemorable ? `Number of Words: ${length}` : `Length: ${length}`}
        </label>
        <Slider
          min={isPin ? 3 : isMemorable ? 4 : 6}
          max={isPin ? 12 : isMemorable ? 16 : 64}
          value={length}
          onChange={onLengthChange}
        />
      </div>

      {/* Show checkboxes based on password type */}
      {isRandom && (
        <>
          <div className="rules-section">
            <Checkbox
              checked={includeNumbers}
              onChange={(e) => onIncludeNumbersChange(e.target.checked)}
            >
              Include Numbers
            </Checkbox>
          </div>

          <div className="rules-section">
            <Checkbox
              checked={includeSymbols}
              onChange={(e) => onIncludeSymbolsChange(e.target.checked)}
            >
              Include Special Characters
            </Checkbox>
          </div>
        </>
      )}

      {isMemorable && onCapitalizeFirstLetterChange && (
        <div className="rules-section">
          <Checkbox
            checked={capitalizeFirstLetter || false}
            onChange={(e) => onCapitalizeFirstLetterChange(e.target.checked)}
          >
            Capitalize First Letter
          </Checkbox>
        </div>
      )}
    </Card>
  );
}
