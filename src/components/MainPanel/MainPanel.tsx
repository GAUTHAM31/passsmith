import { useState } from 'react';
import { Button } from 'antd';
import InputsCard from '../InputsCard/InputsCard';
import RulesCard from '../RulesCard/RulesCard';
import OutputCard from '../OutputCard/OutputCard';
import { PasswordType, Profile } from '../../types/enums';
import './MainPanel.css';
import { generatePassword } from '../../services/passwordGenerator';
import { getDomain } from '../../utils/urlUtils';

export default function MainPanel() {
  const [url, setUrl] = useState('');
  const [masterPass, setMasterPass] = useState('');
  const [profile, setProfile] = useState<Profile>(Profile.Personal);
  const [passwordType, setPasswordType] = useState<PasswordType>(PasswordType.Random);
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [capitalizeFirstLetter, setCapitalizeFirstLetter] = useState(false);
  const [password, setPassword] = useState('');

  const handlePasswordTypeChange = (newType: PasswordType) => {
    setPasswordType(newType);
    // Adjust length based on password type
    if (newType === PasswordType.Pin) {
      // PIN: 3-12
      if (length < 3) {
        setLength(3);
      } else if (length > 12) {
        setLength(12);
      }
    } else if (newType === PasswordType.Memorable) {
      // Memorable: 4-16 words
      if (length < 4) {
        setLength(4);
      } else if (length > 16) {
        setLength(16);
      }
    }
  };

  const handleGenerate = async () => {
    // TODO: Implement password generation logic
    const cleanedUrl = getDomain(url);
    try {
      const generatedPassword = await generatePassword(cleanedUrl, masterPass, profile, passwordType, length, includeNumbers, includeSymbols, capitalizeFirstLetter);
      setPassword(generatedPassword);
      console.log(generatedPassword);
    } catch (error) {
      console.error('Error generating password:', error);
      setPassword('');
    }
  };

  return (
    <div className="main-panel">
      <div className="cards-row">
        <InputsCard
          url={url}
          onUrlChange={setUrl}
          masterPass={masterPass}
          onMasterPassChange={setMasterPass}
          profile={profile}
          onProfileChange={setProfile}
        />

        <RulesCard
          passwordType={passwordType}
          onPasswordTypeChange={handlePasswordTypeChange}
          length={length}
          onLengthChange={setLength}
          includeNumbers={includeNumbers}
          onIncludeNumbersChange={setIncludeNumbers}
          includeSymbols={includeSymbols}
          onIncludeSymbolsChange={setIncludeSymbols}
          capitalizeFirstLetter={capitalizeFirstLetter}
          onCapitalizeFirstLetterChange={setCapitalizeFirstLetter}
        />
      </div>

      <OutputCard
        password={password}
        onCopy={() => {
          if (password) {
            navigator.clipboard.writeText(password);
          }
        }}
      />

      <Button type="primary" size="large" block onClick={handleGenerate}>
       Create Site Password
      </Button>
    </div>
  );
}
