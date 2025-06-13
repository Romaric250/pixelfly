# PixelFly 🚀

Transform any photo into iPhone 14 Pro Max quality with AI-powered enhancement. Simple, fast, and completely free.

## ✨ Features

- **AI Super Resolution**: Transform low-resolution images into crisp, high-quality photos
- **Lightning Fast**: Get professional results in under 2 seconds
- **Privacy First**: Your photos are processed securely and never stored
- **Open Source**: Free to use, modify, and distribute under MIT license

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: Better Auth with email/password + Google OAuth
- **Database**: MongoDB with Prisma ORM
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Font**: Outfit (sophisticated and modern)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/romaric250/pixelfly.git
   cd pixelfly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   DATABASE_URL="your-mongodb-connection-string"
   BETTER_AUTH_SECRET="your-super-secret-key"
   BETTER_AUTH_URL="http://localhost:3001"
   NEXT_PUBLIC_APP_URL="http://localhost:3001"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🔐 Authentication Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

## 📁 Project Structure

```
pixelfly/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── landing/           # Landing page components
│   └── ui/                # UI components
├── lib/                   # Utility functions
│   ├── auth.ts            # Better Auth configuration
│   └── auth-client.ts     # Client-side auth utilities
├── prisma/                # Database schema
└── public/                # Static assets
```

## 🎨 Design System

- **Colors**: White + Lilac/Purple (#7C3AED)
- **Typography**: Outfit font family
- **Components**: Minimal, sophisticated design
- **Animations**: Subtle Framer Motion effects

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Romaric Lonfonyuy**
- GitHub: [@romaric250](https://github.com/romaric250)

## 🌟 Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

Made with ❤️ by [Romaric Lonfonyuy](https://github.com/romaric250)
