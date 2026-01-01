import { Card, Input, Space } from 'antd';
import CopyButton from '../Shared/CopyButton';
import type { OutputCardProps } from '../../types';
import './OutputCard.css';

export default function OutputCard({ password, onCopy }: OutputCardProps) {
  return (
    <Card title="Derive Password" className="output-card">
      <Space.Compact style={{ width: '100%' }}>
        <Input
          readOnly
          placeholder="Same inputs will always recreate this password"
          value={password}
          className="password-input"
        />
        <CopyButton text={password} onCopy={onCopy} />
      </Space.Compact>
    </Card>
  );
}
