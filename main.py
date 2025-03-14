from flask import Flask
from flask_cors import CORS
from routes import app
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting Flask server on port 5000...")
    app.run(host="0.0.0.0", port=5000, debug=True)