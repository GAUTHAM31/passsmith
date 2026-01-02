// src/services/passwordGenerator.ts
import { Profile, PasswordType } from '../types/enums';
import { MEMORABLE_WORDS } from '../constants/memorableWords';

// Character pools for password generation
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?';

/**
 * Options for password generation
 */
interface PasswordOptions {
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

/**
 * Expand a binary seed into lengthBytes deterministic random bytes using HKDF (HMAC-SHA-256).
 *
 * Uses the Web Crypto API (window.crypto.subtle).
 *
 * @param seed        - Uint8Array (e.g. PBKDF2 output). Treated as IKM for HKDF.
 * @param info        - Context string (e.g. "PassSmith-Random-Characters").
 * @param lengthBytes - Number of bytes to derive (e.g. 64).
 * @param salt        - Optional Uint8Array salt for HKDF-Extract. If omitted, uses empty salt.
 * @returns           - A Promise resolving to a Uint8Array of length `lengthBytes`.
 */
export async function expandSeedWithHKDF(
  seed: Uint8Array,
  info: string,
  lengthBytes: number,
  salt?: Uint8Array
): Promise<Uint8Array> {
  if (!window?.crypto?.subtle) {
    throw new Error('Web Crypto API is not available in this environment.');
  }
  if (lengthBytes <= 0) {
    return new Uint8Array(0);
  }

  const subtle = window.crypto.subtle;
  const enc = new TextEncoder();

  // If no salt provided, use empty buffer
  const hkdfSalt = salt ?? new Uint8Array([]);

  // Import the seed as a raw crypto key usable for deriveBits (HKDF)
  // Create a new Uint8Array to ensure proper ArrayBuffer type
  const seedCopy = new Uint8Array(seed);
  const baseKey = await subtle.importKey(
    'raw',
    seedCopy,
    { name: 'HKDF' },
    false,
    ['deriveBits']
  );

  // Prepare HKDF params
  // Create new ArrayBuffer instances to ensure correct type
  const infoBytes = enc.encode(info);
  const hkdfParams: HkdfParams = {
    name: 'HKDF',
    hash: 'SHA-256',
    salt: new Uint8Array(hkdfSalt).buffer,
    info: new Uint8Array(infoBytes).buffer
  };

  // deriveBits returns an ArrayBuffer of the requested bit length
  const derivedBitsBuffer = await subtle.deriveBits(hkdfParams, baseKey, lengthBytes * 8);

  return new Uint8Array(derivedBitsBuffer);
}

/**
 * Derive a seed from master password, URL, and profile using PBKDF2.
 */
async function deriveSeed(
  masterPass: string,
  url: string,
  profile: Profile
): Promise<Uint8Array> {
  if (!window?.crypto?.subtle) {
    throw new Error('Web Crypto API is not available in this environment.');
  }

  const subtle = window.crypto.subtle;
  const enc = new TextEncoder();

  // Create salt from URL and profile
  const saltString = `${url}:${profile}`;
  const salt = enc.encode(saltString);

  // Import master password as a key
  // Create a new Uint8Array to ensure proper ArrayBuffer type
  const masterPassBytes = enc.encode(masterPass);
  const keyMaterial = await subtle.importKey(
    'raw',
    new Uint8Array(masterPassBytes),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // Derive 32 bytes (256 bits) using PBKDF2
  // Create new ArrayBuffer to ensure correct type
  const derivedBits = await subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(salt).buffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256 // 32 bytes = 256 bits
  );

  return new Uint8Array(derivedBits);
}

/**
 * Converts deterministic random bytes into a strong password.
 * Same bytes + same options => same password.
 */
export function mapBytesToPassword(
  randomBytes: Uint8Array,
  options: PasswordOptions
): string {
  const { length, includeNumbers, includeSymbols } = options;

  if (length < 4) {
    throw new Error('Password length too short');
  }

  let byteIndex = 0;
  const nextByte = () => randomBytes[byteIndex++ % randomBytes.length];

  // Step 1: Build pools
  const requiredPools: string[] = [LOWER, UPPER];
  if (includeNumbers) requiredPools.push(NUMBERS);
  if (includeSymbols) requiredPools.push(SYMBOLS);

  const fullPool =
    LOWER +
    UPPER +
    (includeNumbers ? NUMBERS : '') +
    (includeSymbols ? SYMBOLS : '');

  if (fullPool.length === 0) {
    throw new Error('No character pools available');
  }

  // Step 2: Pick required characters
  const passwordChars: string[] = [];

  for (const pool of requiredPools) {
    const b = nextByte();
    passwordChars.push(pool[b % pool.length]);
  }

  // Step 3: Fill remaining characters
  while (passwordChars.length < length) {
    const b = nextByte();
    passwordChars.push(fullPool[b % fullPool.length]);
  }

  // Step 4: Deterministic Fisher–Yates shuffle
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const b = nextByte();
    const j = b % (i + 1);
    [passwordChars[i], passwordChars[j]] = [
      passwordChars[j],
      passwordChars[i],
    ];
  }

  // Step 5: Final password
  return passwordChars.join('');
}

/**
 * Converts deterministic random bytes into a numeric PIN.
 * Same bytes + same length => same PIN.
 */
export function mapBytesToPIN(
  randomBytes: Uint8Array,
  length: number
): string {
  if (length < 3 || length > 12) {
    throw new Error('PIN length must be between 3 and 12');
  }

  let byteIndex = 0;
  const nextByte = () => randomBytes[byteIndex++ % randomBytes.length];

  const pinDigits: string[] = [];

  // Generate each digit deterministically
  for (let i = 0; i < length; i++) {
    const b = nextByte();
    // Map byte value (0-255) to digit (0-9)
    const digit = b % 10;
    pinDigits.push(digit.toString());
  }

  return pinDigits.join('');
}


/**
 * Converts deterministic random bytes into a memorable password.
 * Uses word-based approach - joins specified number of words with hyphens.
 * Same bytes + same word count => same password.
 */
export function mapBytesToMemorable(
  randomBytes: Uint8Array,
  wordCount: number,
  capitalizeFirstLetter: boolean = false
): string {
  if (wordCount < 4 || wordCount > 16) {
    throw new Error('Word count must be between 4 and 16');
  }

  let byteIndex = 0;
  const nextByte = () => randomBytes[byteIndex++ % randomBytes.length];

  const words: string[] = [];

  // Select words deterministically
  for (let i = 0; i < wordCount; i++) {
    const b = nextByte();
    const wordIndex = b % MEMORABLE_WORDS.length;
    let word = MEMORABLE_WORDS[wordIndex];
    
    // Capitalize first letter of each word if requested
    if (capitalizeFirstLetter) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    
    words.push(word);
  }

  // Join words with hyphens
  return words.join('-');
}

export async function generatePassword(
  url: string,
  masterPass: string,
  profile: Profile,
  type: PasswordType,
  length: number,
  includeNumbers: boolean,
  includeSymbols: boolean,
  capitalizeFirstLetter: boolean = false
): Promise<string> {
  console.log('Generating password with parameters:', {
    url,
    masterPass,
    profile,
    type,
    length,
    includeNumbers,
    includeSymbols,
    capitalizeFirstLetter,
  });

  // Derive seed from master password, URL, and profile
  const seed = await deriveSeed(masterPass, url, profile);

  // Create info string based on password type and requirements
  let info = `PassSmith-${type}-`;
  if (type === PasswordType.Random) {
    info += `${includeNumbers ? 'N' : ''}${includeSymbols ? 'S' : ''}`;
  } else if (type === PasswordType.Memorable) {
    info += `${capitalizeFirstLetter ? 'C' : ''}`;
  }

  // Expand seed to get enough bytes for password generation
  // We need enough bytes for: required chars + remaining chars + shuffle operations
  // Estimate: length (for chars) + length (for shuffle) + some buffer
  const lengthBytes = Math.max(length * 2, 64); // Ensure we have enough bytes
  const randomBytes = await expandSeedWithHKDF(seed, info, lengthBytes);

  // Convert randomBytes to password based on type, length, includeNumbers, includeSymbols
  if (type === PasswordType.Random) {
    return mapBytesToPassword(randomBytes, {
      length,
      includeNumbers,
      includeSymbols,
    });
  }

  if (type === PasswordType.Pin) {
    return mapBytesToPIN(randomBytes, length);
  }

  if (type === PasswordType.Memorable) {
    // For memorable passwords, length represents word count (4-16)
    return mapBytesToMemorable(randomBytes, length, capitalizeFirstLetter);
  }

  throw new Error(`Password type ${type} not yet implemented`);
}