# ClipLink

ClipLink is a fast, secure, and modern URL shortener and link analytics platform. It allows users to create concise, manageable links from long URLs, customize them, and track their performance in real-time. Whether you are managing marketing campaigns, sharing resources, or just tidying up your links, ClipLink provides the powerful tools you need in an intuitive interface.

## Key Features

- **Link Shortening**: Instantly convert long, unwieldy URLs into concise, shareable links.
- **Custom Aliases**: Personalize your links with custom aliases to reinforce your brand.
- **Real-time Analytics**: Gain insights with click tracking, geographical data, and traffic sources over time.
- **Dashboard Management**: A comprehensive dashboard to view, edit, and organize all your shortened links.
- **Secure Authentication**: User accounts keep your links and analytics private and personalized.
- **Dark Mode Support**: Seamless toggle between light and dark themes for the best viewing experience.

## Tech Stack

**Backend:**

- Java 17+ with Spring Boot
- Spring Security for Authentication
- Maven for dependency management
- postgres for data storage

**Frontend:**

- React (with TypeScript)
- Tailwind CSS & shadcn/ui for beautiful, responsive design
- React Router for client-side routing

## Project Structure

- `frontend/`: React frontend application built with Vite, Tailwind CSS, and shadcn/ui.
- `backend/`: Spring Boot Java application handling URL shortening, redirection, and analytics.

## Getting Started

### Prerequisites

- Node.js (for frontend)
- Java 17+ (for backend)
- Maven

### Running Locally

**Backend:**

```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request