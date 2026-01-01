# PassSmith 🔐

**Never forget a strong password again.**

PassSmith is a deterministic password generator that creates strong, unique passwords for each website using your master password, URL, and profile. The same inputs always generate the same password, so you never need to store or remember individual passwords.

## ✨ Features

### 🔒 Security First
- **Zero Storage**: Your master password is never stored or transmitted. Everything happens in your browser.
- **Deterministic Generation**: Same inputs = same password, every time
- **Cryptographically Secure**: Uses PBKDF2 (100,000 iterations) and HKDF (HMAC-SHA-256) for password derivation
- **Domain Extraction**: Automatically extracts and uses only the root domain (e.g., `example.com` from `https://www.example.com/path`)

### 🎯 Password Types

1. **Random Passwords**
   - Complex, cryptographically secure passwords
   - Configurable length (6-64 characters)
   - Optional numbers and special characters
   - Perfect for maximum security

2. **Memorable Passwords**
   - Word-based passwords that are easy to remember
   - 4-16 words joined with hyphens
   - Optional capitalization of first letters
   - Example: `apple-banana-carrot-dolphin`

3. **PIN Passwords**
   - Numeric-only passwords
   - Length: 3-12 digits
   - Perfect for PIN codes and numeric-only systems

### 👤 Profile System

Create different passwords for the same website using profiles:
- **Social**: Social media accounts
- **Work**: Professional accounts
- **Personal**: Personal accounts
- **Banking**: Financial services
- **Shared**: Shared accounts
- **Shopping**: E-commerce sites
- **Email**: Email accounts
- **Gaming**: Gaming platforms

### 🎨 User Experience

- **Clean, Modern UI**: Built with Ant Design for a polished experience
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **Inline Helper Text**: Micro-education to reduce confusion
- **One-Click Copy**: Copy generated passwords instantly
- **Real-time Generation**: Passwords generated instantly as you type

## 🚀 How It Works

PassSmith uses a deterministic password generation algorithm:

1. **Input Collection**: You provide:
   - Website URL (e.g., `https://example.com`)
   - Master Password (your secret)
   - Profile (e.g., Work, Personal)
   - Password type and preferences

2. **Domain Extraction**: The URL is processed to extract only the root domain (removes subdomains, paths, etc.)

3. **Seed Derivation**: 
   - Uses PBKDF2 with 100,000 iterations
   - Combines: Master Password + Domain + Profile
   - Creates a cryptographically secure seed

4. **Password Generation**:
   - Uses HKDF (HMAC-based Key Derivation Function) to expand the seed
   - Applies your preferences (length, character types, etc.)
   - Generates the final password deterministically

5. **Result**: The same inputs always produce the same password, so you can regenerate it anytime without storing it.

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd passsmith
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Ant Design** - UI component library
- **Web Crypto API** - Cryptographic operations (PBKDF2, HKDF)

## 📁 Project Structure

```
passsmith/
├── src/
│   ├── components/        # React components
│   │   ├── InputsCard/    # URL, Master Password, Profile inputs
│   │   ├── RulesCard/     # Password type and rules
│   │   ├── OutputCard/    # Generated password display
│   │   └── Shared/        # Shared components
│   ├── services/          # Business logic
│   │   └── passwordGenerator.ts  # Core password generation
│   ├── utils/             # Utility functions
│   │   └── urlUtils.ts    # URL domain extraction
│   ├── constants/          # Constants
│   │   └── memorableWords.ts  # Word list for memorable passwords
│   ├── types/             # TypeScript types
│   └── App.tsx            # Main app component
├── public/                # Static assets
└── package.json
```

## 🔐 Security Considerations

- **No Network Requests**: All password generation happens locally in your browser
- **No Storage**: Master passwords are never stored, cached, or transmitted
- **Cryptographic Standards**: Uses industry-standard algorithms (PBKDF2, HKDF, SHA-256)
- **Open Source**: Code is open for security audits

## 💡 Usage Tips

1. **Choose a Strong Master Password**: This is the only password you need to remember. Make it strong and unique.

2. **Use Profiles Wisely**: 
   - Use different profiles for the same site when you need multiple accounts
   - Example: `github.com` with "Work" profile vs "Personal" profile

3. **Password Types**:
   - Use **Random** for maximum security (banks, email)
   - Use **Memorable** for accounts you might need to type manually
   - Use **PIN** for numeric-only systems

4. **Remember Your Settings**: The same settings (length, character types, etc.) must be used to regenerate the same password.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by deterministic password generators like [Master Password](https://masterpassword.app/)

---

**Remember**: Your master password is the key to all your generated passwords. Keep it safe and never share it!
