import { Card, Input, Select } from 'antd';
import LabeledField from '../Shared/LabeledField';
import type { InputsCardProps } from '../../types';
import { Profile } from '../../types/enums';
import './InputsCard.css';

const profileOptions = [
  { value: Profile.Social, label: 'Social' },
  { value: Profile.Work, label: 'Work' },
  { value: Profile.Personal, label: 'Personal' },
  { value: Profile.Banking, label: 'Banking' },
  { value: Profile.Shared, label: 'Shared' },
  { value: Profile.Shopping, label: 'Shopping' },
  { value: Profile.Email, label: 'Email' },
  { value: Profile.Gaming, label: 'Gaming' },
];

export default function InputsCard({
  url,
  onUrlChange,
  masterPass,
  onMasterPassChange,
  profile,
  onProfileChange,
}: InputsCardProps) {
  return (
    <Card title="Inputs" className="inputs-card">

      <LabeledField 
        label="Master Password" 
        required
        helperText="Never stored. Used only in your browser."
      >
        <Input.Password
          placeholder="Enter your master password"
          value={masterPass}
          onChange={(e) => onMasterPassChange(e.target.value)}
        />
      </LabeledField>

      
      <LabeledField 
        label="URL" 
        required
        helperText="Used to make the password unique per website."
      >
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
        />
      </LabeledField>

      

      <LabeledField 
        label="Profile" 
        required
        helperText="Create different passwords for the same site (e.g. Work, Personal)."
      >
        <Select
          placeholder="Select a profile"
          value={profile}
          onChange={onProfileChange}
          options={profileOptions}
          style={{ width: '100%' }}
        />
      </LabeledField>
    </Card>
  );
}
