# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory
WORKDIR /code

# Copy the requirements file into the container
COPY ./backend/requirements.txt /code/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Create a directory for the database with open permissions (so HF Spaces user can write to it)
RUN mkdir -p /home/user/.ai_sentiment_analyzer && chmod 777 /home/user/.ai_sentiment_analyzer
ENV HOME=/home/user

# Copy the current directory contents into the container at /code
COPY ./backend /code/backend

# Set the working directory to the backend code
WORKDIR /code/backend

# Expose port 7860, which is the default port for Hugging Face Spaces
EXPOSE 7860

# Run uvicorn when the container launches
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
