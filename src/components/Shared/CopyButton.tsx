import { Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import type { CopyButtonProps } from '../../types';

export default function CopyButton({ text, onCopy }: CopyButtonProps) {
  const handleClick = () => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        onCopy?.();
        // TODO: Show toast notification "Copied to clipboard!"
      });
    }
  };

  return (
    <Button
      icon={<CopyOutlined />}
      onClick={handleClick}
      disabled={!text}
      title="Copy to clipboard"
    />
  );
}
