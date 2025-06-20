# Gunicorn configuration file for PixelFly Backend
import multiprocessing
import os

# Server socket
bind = f"0.0.0.0:{os.getenv('PORT', '5001')}"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Restart workers after this many requests, to help prevent memory leaks
max_requests = 1000
max_requests_jitter = 100

# Logging
accesslog = "-"  # Log to stdout
errorlog = "-"   # Log to stderr
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "pixelfly-backend"

# Server mechanics
daemon = False
pidfile = None
user = None
group = None
tmp_upload_dir = None

# SSL (if needed)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"

# Environment variables
raw_env = [
    'PYTHONPATH=.',
]

# Preload application for better performance
preload_app = True

# Worker timeout for image processing
timeout = 60  # Increased for image processing

# Memory management
max_requests = 500  # Restart workers after 500 requests to prevent memory leaks
max_requests_jitter = 50

def when_ready(server):
    server.log.info("🚀 PixelFly Backend Server is ready. Listening on %s", server.address)

def worker_int(worker):
    worker.log.info("🔄 Worker received INT or QUIT signal")

def pre_fork(server, worker):
    server.log.info("👷 Worker spawned (pid: %s)", worker.pid)

def post_fork(server, worker):
    server.log.info("✅ Worker spawned (pid: %s)", worker.pid)

def post_worker_init(worker):
    worker.log.info("🎯 Worker initialized (pid: %s)", worker.pid)

def worker_abort(worker):
    worker.log.info("❌ Worker received SIGABRT signal")
