/**
 * Password generation type
 */
import { PasswordType, Profile } from "./enums";

/**
 * Main state for password generation
 */
export interface MainPanelState {
  url: string;
  masterPass: string;
  profile: Profile;
  passwordType: PasswordType;
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  generatedPassword: string;
}

/**
 * Props for InputsCard component
 */
export interface InputsCardProps {
  url: string;
  onUrlChange: (value: string) => void;
  masterPass: string;
  onMasterPassChange: (value: string) => void;
  profile: Profile;
  onProfileChange: (value: Profile) => void;
}

/**
 * Props for RulesCard component
 */
export interface RulesCardProps {
  passwordType: PasswordType;
  onPasswordTypeChange: (type: PasswordType) => void;
  length: number;
  onLengthChange: (value: number) => void;
  includeNumbers: boolean;
  onIncludeNumbersChange: (value: boolean) => void;
  includeSymbols: boolean;
  onIncludeSymbolsChange: (value: boolean) => void;
  capitalizeFirstLetter?: boolean;
  onCapitalizeFirstLetterChange?: (value: boolean) => void;
}

/**
 * Props for OutputCard component
 */
export interface OutputCardProps {
  password: string;
  onCopy: () => void;
}

/**
 * Props for CopyButton component
 */
export interface CopyButtonProps {
  text: string;
  onCopy?: () => void;
}

/**
 * Props for LabeledField component
 */
export interface LabeledFieldProps {
  label: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}
