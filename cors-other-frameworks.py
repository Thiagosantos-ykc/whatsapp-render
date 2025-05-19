# Python with Flask
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Basic CORS (allows all origins)

# OR for more specific configuration:
cors = CORS(app, resources={
    r"/qrcode": {"origins": "https://your-lovable-domain.com"}
})

@app.route('/qrcode')
def qrcode():
    # Your QR code logic here
    pass


# Python with Django
# In settings.py
INSTALLED_APPS = [
    # other apps
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # other middleware - make sure it's at the top
]

# Allow all origins (development only)
CORS_ALLOW_ALL_ORIGINS = True

# OR for production, specify allowed origins:
CORS_ALLOWED_ORIGINS = [
    "https://your-lovable-domain.com",
]


# Ruby on Rails
# In config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://your-lovable-domain.com'
    resource '/qrcode',
      headers: :any,
      methods: [:get, :post, :options]
  end
end
