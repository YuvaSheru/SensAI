# AI-Powered Career Coach & Resume Builder

<div align="center">
  <img src="public/banner.png" alt="AI Career Coach Banner" width="100%" />
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)](https://neon.tech)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

A modern web application built with Next.js that helps users create professional resumes and advance their careers using AI technology. Transform your career journey with AI-powered resume building, job search, and personalized career insights.

## ✨ Features

- 🤖 AI-powered resume improvement with Google Gemini
- 📝 Professional resume builder with markdown support
- 💼 Job search with advanced filters and company insights
- 🎯 Personalized career insights and recommendations
- 📊 Industry analytics and salary trends
- 🔄 Real-time preview and editing
- 📱 Responsive design for all devices
- 🌙 Dark/Light mode support
- 🔐 Secure authentication with Clerk

## 🛠️ Tech Stack

- **Framework:** Next.js 14 with App Router
- **Database:** Neon DB (PostgreSQL)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **ORM:** Prisma
- **Authentication:** Clerk
- **Job Data:** Adzuna API
- **AI Integration:** Google Gemini AI
- **Background Jobs:** Inngest
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon)
- Google Gemini API key
- Clerk account for authentication

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-career-coach.git
cd ai-career-coach
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Update the `.env` file with your credentials:
```
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
GEMINI_API_KEY=
```

5. Set up the database
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📱 Key Features Walkthrough

### Resume Builder
- AI-powered content improvement
  - Smart suggestions for professional summaries
  - Experience description enhancement
  - Skills optimization based on job market
  - Real-time improvement suggestions
- Markdown support for formatting
  - Headers, lists, and emphasis
  - Custom styling options
  - Professional templates
- Real-time preview
  - Side-by-side editing and preview
  - Mobile view preview
  - PDF layout preview
- PDF export functionality
  - Multiple resume formats
  - Custom styling options
  - ATS-friendly output

### Job Search
- Advanced filtering options
  - Salary range filters
  - Experience level filtering
  - Remote/hybrid/onsite preferences
  - Industry-specific searches
- Company insights
  - Company size and funding
  - Work culture information
  - Growth trajectory
- Salary information
  - Industry benchmarks
  - Location-based adjustments
  - Experience-based ranges
- Application tracking
  - Status monitoring
  - Follow-up reminders
  - Application analytics

### Career Insights
- Industry trends
  - Growing sectors
  - In-demand skills
  - Emerging technologies
- Salary benchmarks
  - Role-based comparisons
  - Geographic variations
  - Experience level impacts
- Skill recommendations
  - Gap analysis
  - Learning resources
  - Certification suggestions
- Career path suggestions
  - Role progression maps
  - Skill development timelines
  - Industry transition guides

## 🔧 Troubleshooting Guide

### Common Issues and Solutions

1. **AI Improvement Not Working**
   - Verify your Gemini API key is correctly set in `.env`
   - Ensure you have sufficient API credits
   - Check your internet connection
   - Try with a shorter text input first

2. **Database Connection Issues**
   - Verify DATABASE_URL in `.env`
   - Check if Neon DB is accessible
   - Run `npx prisma db push` again
   - Ensure proper SSL configuration

3. **Authentication Problems**
   - Verify Clerk credentials in `.env`
   - Clear browser cookies and cache
   - Check if all Clerk URLs are correctly set
   - Ensure Clerk application settings match

4. **PDF Export Issues**
   - Clear browser cache
   - Try in incognito mode
   - Ensure content is not too large
   - Check for unsupported characters

## ❓ Frequently Asked Questions

1. **How does the AI improvement work?**
   - Uses Google Gemini AI to analyze and enhance your content
   - Considers industry standards and best practices
   - Maintains your original message while improving clarity
   - Focuses on impactful and quantifiable achievements

2. **Is my data secure?**
   - All data is encrypted in transit and at rest
   - Personal information is handled according to GDPR
   - No data is shared with third parties
   - Regular security audits are performed

3. **Can I use custom templates?**
   - Yes, markdown format allows full customization
   - Multiple pre-built templates available
   - Custom CSS can be applied
   - Templates can be saved for future use

4. **How often is job data updated?**
   - Job listings refresh every 6 hours
   - Salary data updated weekly
   - Industry insights refreshed monthly
   - Real-time company information

## 🚀 Deployment

### Vercel Deployment
1. Fork this repository
2. Create a new project in Vercel
3. Connect your forked repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Environment Setup
```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Database migrations
npx prisma generate
npx prisma db push
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Clerk](https://clerk.dev/) for authentication
- [Neon](https://neon.tech) for the serverless PostgreSQL database
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities
