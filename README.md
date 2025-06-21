# PixelFly 🚀

Make your photos pop out with AI-powered enhancement. Simple, fast, and completely free.

## ✨ Features

- **AI Photo Enhancement**: Make your photos pop out with stunning clarity
- **Bulk Watermarking**: Add watermarks to multiple photos at once
- **Lightning Fast**: Get results in under 2 seconds
- **Open Source**: Free to use and modify

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Python API (separate repository: [pixelfly-backend](https://github.com/romaric250/pixelfly-backend))
- **Authentication**: Better Auth with Google OAuth
- **Database**: MongoDB with Prisma ORM

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/romaric250/pixelfly.git
cd pixelfly

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Romaric Lonfonyuy** - [@romaric250](https://github.com/romaric250)
