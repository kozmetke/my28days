# My28Days - Support Community for Premature Menopause

My28Days is a social platform designed specifically for women experiencing premature menopause, providing a safe and supportive space to connect, share experiences, and seek advice.

## Features

- **User Authentication**
  - Secure email/password registration and login
  - Profile customization with medical history
  - Onboarding flow for new users

- **Social Features**
  - Create and share posts with different categories
  - Like and comment on posts
  - Follow other users
  - Anonymous posting option for sensitive topics
  - Real-time notifications for interactions

- **Medical Support**
  - Track symptoms and treatments
  - Share experiences and advice
  - Form communities around specific topics
  - Access to shared resources

- **Search & Discovery**
  - Search posts and users
  - Filter posts by categories
  - Discover users with similar experiences

## Tech Stack

- **Frontend**
  - Next.js 13+ with App Router
  - TypeScript
  - Tailwind CSS
  - React Icons
  - Date-fns

- **Backend**
  - Next.js API Routes
  - MongoDB with Mongoose
  - NextAuth.js for authentication
  - Cloudinary for image uploads

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
my28days/
├── src/
│   ├── app/                 # Next.js 13 app directory
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   └── ...            # Other pages
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   ├── models/            # MongoDB models
│   └── types/             # TypeScript types
├── public/                # Static files
└── ...
```

## Key Features Implementation

### Authentication
- Uses NextAuth.js for secure authentication
- Custom credentials provider with email/password
- JWT session handling
- Protected API routes and pages

### Posts
- Rich text content
- Category tagging
- Anonymous posting option
- Like and comment functionality
- Infinite scrolling for posts and comments

### Notifications
- Real-time notifications for:
  - Likes on posts
  - Comments on posts
  - New followers
- Mark as read functionality
- Clear all notifications option

### Search
- Full-text search for posts
- User search
- Category filtering
- Pagination for search results

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
