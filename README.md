# Interior Pilot - AI Interior Design Platform

Interior Pilot is a full-stack web application that leverages AI to generate interior design concepts and layouts based on user preferences, room layouts and floorplan.

## 🚀 Features

- AI-powered interior design generation
- 3D layout visualization
- Room design customization
- Multiple design style options
- Real-time image processing
- Secure file storage with AWS S3

## 🛠️ Tech Stack

### Backend
- Django 5.1.6
- Django REST Framework 3.15.2
- Replicate AI for image generation
- AWS S3 for file storage
- SQLITE

### Frontend
- React 19.0.0
- Tailwind CSS 4.0.9
- Framer Motion for animations
- React Router for navigation
- Axios for API communication

## 📋 Prerequisites

- Python 3.11
- Node.js 18+
- Docker and Docker Compose (optional)
- AWS Account with S3 bucket
- Replicate AI API key

## 🔧 Environment Variables

### Backend (.env)
```
DJANGO_SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
REPLICATE_API_TOKEN=your_replicate_api_token
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_aws_region
HF_API_TOKEN=your_hf_api_token
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## 🚀 Installation and Setup

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/interior-pilot.git
cd interior-pilot
```

2. Create and configure environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start the application using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

### Manual Setup

#### Backend
1. Create a Python virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start the development server:
```bash
python manage.py runserver
```

#### Frontend
1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
python manage.py test
```

To run tests with coverage:
```bash
coverage run manage.py test
coverage report
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
interior-pilot/
├── backend/
│   ├── api/                 # Django REST API
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API endpoints
│   │   ├── serializers.py  # Data serializers
│   │   ├── urls.py         # URL routing
│   │   └── tests.py        # Test cases
│   ├── interior_pilot/      # Django project settings
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── package.json       # Node.js dependencies
└── docker-compose.yml     # Docker configuration
```

## 🔒 Security Considerations

- All API keys and secrets should be stored in environment variables
- AWS S3 bucket should have proper CORS configuration
- Frontend should validate file types and sizes before upload
- Backend implements proper authentication and authorization
- Rate limiting is implemented for API endpoints

## API Endpoints

### Design Generation
- `POST /api/generate/` - Generate interior design
- `POST /api/generate-3d-layout/` - Generate 3D layout
- `POST /api/room-design/` - Generate 3D model
- `POST /api/upload-image/` - Upload room image


## Error Handling

The API uses standard HTTP response codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 👥 Authors

- Usman Mufti - Initial work

## 🙏 Acknowledgments

- Replicate AI for providing the image generation models
- AWS for cloud storage solutions
