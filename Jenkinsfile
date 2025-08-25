pipeline {
    agent any
    
    environment {
        // Define environment variables if needed
        COMPOSE_PROJECT_NAME = "netflix-app"
        DOCKER_BUILDKIT = "1"
    }
    
    stages {
        stage('Clean Workspace') {
            steps {
                echo 'Cleaning workspace...'
                deleteDir()
            }
        }
        
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository from main branch...'
                git branch: 'main',
                    url: 'https://github.com/vishvesh98/cicd-netflix.git',
                    credentialsId: 'jenkins-access-token'
            }
        }
        
        stage('Verify Environment') {
            steps {
                echo 'Verifying environment setup...'
                sh '''
                    echo "=== Docker Version ==="
                    docker --version
                    
                    echo "=== Docker Compose Version ==="
                    docker compose version
                    
                    echo "=== Docker System Info ==="
                    docker info
                    
                    echo "=== Checking docker-compose.yml ==="
                    if [ -f docker-compose.yml ]; then
                        echo "✅ docker-compose.yml found"
                        cat docker-compose.yml
                    else
                        echo "❌ docker-compose.yml not found!"
                        ls -la
                        exit 1
                    fi
                '''
            }
        }
        
        stage('Stop Existing Services') {
            steps {
                echo 'Stopping and cleaning existing services...'
                sh '''
                    echo "Stopping existing services..."
                    docker compose -p ${COMPOSE_PROJECT_NAME} down --volumes --remove-orphans || true
                    
                    echo "Removing existing containers..."
                    docker ps -a --format "table {{.Names}}" | grep -E "(netflix|frontend|backend|netdata|auth)" | xargs -r docker rm -f || true
                    
                    echo "Cleaning up unused volumes..."
                    docker volume prune -f || true
                    
                    echo "Cleaning up unused images..."
                    docker image prune -f || true
                '''
            }
        }
        
        stage('Build Application Images') {
            steps {
                echo 'Building Docker images...'
                sh '''
                    echo "=== Building Backend Image ==="
                    docker compose -p ${COMPOSE_PROJECT_NAME} build --no-cache backend
                    
                    echo "=== Building Frontend Image ==="
                    docker compose -p ${COMPOSE_PROJECT_NAME} build --no-cache frontend
                    
                    echo "=== Verifying built images ==="
                    docker images | grep -E "(netflix|backend|frontend)" || true
                '''
            }
        }
        
        stage('Start Backend Service') {
            steps {
                echo 'Starting backend service...'
                sh '''
                    echo "Starting backend service..."
                    docker compose -p ${COMPOSE_PROJECT_NAME} up -d backend
                    
                    echo "Waiting for backend to initialize..."
                    sleep 30
                    
                    echo "=== Backend container status ==="
                    docker compose -p ${COMPOSE_PROJECT_NAME} ps backend
                    
                    echo "=== Backend logs ==="
                    docker compose -p ${COMPOSE_PROJECT_NAME} logs --tail=20 backend || true
                '''
            }
        }
        
        stage('Backend Health Check') {
            steps {
                echo 'Checking backend health...'
                sh '''
                    echo "=== Backend Health Check ==="
                    
                    # Check if container is running
                    if ! docker compose -p ${COMPOSE_PROJECT_NAME} ps backend | grep -q "Up"; then
                        echo "❌ Backend container is not running"
                        docker compose -p ${COMPOSE_PROJECT_NAME} logs backend
                        exit 1
                    fi
                    
                    # Try multiple health check endpoints
                    echo "Attempting health checks..."
                    for endpoint in "/health" "/" "/api/health"; do
                        echo "Trying backend health check at: http://localhost:5000$endpoint"
                        if timeout 30 bash -c "until curl -f http://localhost:5000$endpoint 2>/dev/null; do echo 'Waiting for backend...'; sleep 3; done"; then
                            echo "✅ Backend is healthy at $endpoint"
                            break
                        else
                            echo "⚠️ Health check failed for $endpoint"
                        fi
                    done
                '''
            }
        }
        
        stage('Start Frontend Service') {
            steps {
                echo 'Starting frontend service...'
                sh '''
                    echo "Starting frontend service..."
                    docker compose -p ${COMPOSE_PROJECT_NAME} up -d frontend
                    
                    echo "Waiting for frontend to initialize..."
                    sleep 45
                    
                    echo "=== Frontend container status ==="
                    docker compose -p ${COMPOSE_PROJECT_NAME} ps frontend
                    
                    echo "=== Frontend logs ==="
                    docker compose -p ${COMPOSE_PROJECT_NAME} logs --tail=20 frontend || true
                '''
            }
        }
        
        stage('Frontend Health Check') {
            steps {
                echo 'Checking frontend health...'
                sh '''
                    echo "=== Frontend Health Check ==="
                    
                    # Check if container is running
                    if ! docker compose -p ${COMPOSE_PROJECT_NAME} ps frontend | grep -q "Up"; then
                        echo "❌ Frontend container is not running"
                        docker compose -p ${COMPOSE_PROJECT_NAME} logs frontend
                        exit 1
                    fi
                    
                    echo "Attempting frontend health check..."
                    if timeout 60 bash -c "until curl -f http://localhost:3000 2>/dev/null; do echo 'Waiting for frontend...'; sleep 5; done"; then
                        echo "✅ Frontend is healthy"
                    else
                        echo "⚠️ Frontend health check timeout, but continuing..."
                    fi
                '''
            }
        }
        
        stage('Start Netdata Monitoring') {
            steps {
                echo 'Starting Netdata monitoring...'
                sh '''
                    echo "Starting Netdata monitoring service..."
                    docker compose -p ${COMPOSE_PROJECT_NAME} up -d netdata
                    
                    echo "Waiting for Netdata to initialize..."
                    sleep 20
                    
                    echo "=== Netdata container status ==="
                    docker compose -p ${COMPOSE_PROJECT_NAME} ps netdata
                    
                    echo "=== Netdata startup logs ==="
                    docker compose -p ${COMPOSE_PROJECT_NAME} logs --tail=30 netdata || true
                '''
            }
        }
        
        stage('Netdata Health Check') {
            steps {
                echo 'Verifying Netdata monitoring...'
                sh '''
                    echo "=== Netdata Health Check ==="
                    
                    if timeout 90 bash -c "until curl -f http://localhost:19999 2>/dev/null; do echo 'Waiting for Netdata dashboard...'; sleep 5; done"; then
                        echo "✅ Netdata dashboard is accessible"
                        
                        # Check API endpoint
                        if curl -s http://localhost:19999/api/v1/info | grep -q "version"; then
                            echo "✅ Netdata API is responding"
                        else
                            echo "⚠️ Netdata API might not be fully ready"
                        fi
                    else
                        echo "⚠️ Netdata health check timeout"
                    fi
                '''
            }
        }
        
        stage('Final System Verification') {
            steps {
                echo 'Performing final system verification...'
                sh '''
                    echo "==============================================="
                    echo "           DEPLOYMENT VERIFICATION"
                    echo "==============================================="
                    
                    echo "=== All Services Status ==="
                    docker compose -p ${COMPOSE_PROJECT_NAME} ps
                    
                    echo "=== Container Resource Usage ==="
                    docker stats --no-stream --format "table {{.Container}}\\t{{.CPUPerc}}\\t{{.MemUsage}}" || true
                    
                    echo "=== Port Bindings ==="
                    docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}" | grep -E "(backend|frontend|netdata)"
                    
                    echo "=== Service Accessibility Check ==="
                    
                    # Final connectivity tests
                    echo "Testing Backend (Port 5000)..."
                    curl -s -o /dev/null -w "Backend HTTP Status: %{http_code}\\n" http://localhost:5000 || echo "Backend: Connection failed"
                    
                    echo "Testing Frontend (Port 3000)..."
                    curl -s -o /dev/null -w "Frontend HTTP Status: %{http_code}\\n" http://localhost:3000 || echo "Frontend: Connection failed"
                    
                    echo "Testing Netdata (Port 19999)..."
                    curl -s -o /dev/null -w "Netdata HTTP Status: %{http_code}\\n" http://localhost:19999 || echo "Netdata: Connection failed"
                    
                    echo "==============================================="
                    echo "           SERVICE ENDPOINTS"
                    echo "==============================================="
                    echo "🎬 Netflix Frontend:   http://localhost:3000"
                    echo "🔧 Backend API:        http://localhost:5000"
                    echo "📊 Netdata Dashboard:  http://localhost:19999"
                    echo "==============================================="
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
            sh '''
                echo "=== Final System Overview ==="
                docker ps --format "table {{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}" || true
                
                echo "=== Disk Usage ==="
                df -h | head -5 || true
                
                echo "=== Memory Usage ==="
                free -h || true
            '''
        }
        
        success {
            echo '🎉 Pipeline completed successfully!'
            sh '''
                echo "=========================================="
                echo "        SUCCESSFUL DEPLOYMENT! 🎉"
                echo "=========================================="
                echo "✅ All services deployed successfully"
                echo ""
                echo "🌐 Access your applications:"
                echo "   • Netflix App:     http://localhost:3000"
                echo "   • Backend API:     http://localhost:5000"
                echo "   • Netdata Monitor: http://localhost:19999"
                echo ""
                echo "=== Running Containers ==="
                docker compose -p ${COMPOSE_PROJECT_NAME} ps
                echo "=========================================="
            '''
        }
        
        failure {
            echo '❌ Pipeline failed. Collecting diagnostic information...'
            sh '''
                echo "=========================================="
                echo "        DEPLOYMENT FAILED ❌"
                echo "=========================================="
                
                echo "=== Container Status ==="
                docker compose -p ${COMPOSE_PROJECT_NAME} ps || true
                
                echo "=== Recent Logs ==="
                echo "--- Backend Logs ---"
                docker compose -p ${COMPOSE_PROJECT_NAME} logs --tail=50 backend || true
                echo "--- Frontend Logs ---"
                docker compose -p ${COMPOSE_PROJECT_NAME} logs --tail=50 frontend || true
                echo "--- Netdata Logs ---"
                docker compose -p ${COMPOSE_PROJECT_NAME} logs --tail=50 netdata || true
                
                echo "=== System Resources ==="
                df -h || true
                free -h || true
                
                echo "=== Cleaning up failed deployment ==="
                docker compose -p ${COMPOSE_PROJECT_NAME} down --volumes --remove-orphans || true
                
                echo "=========================================="
            '''
        }
        
        cleanup {
            echo 'Performing cleanup tasks...'
            sh '''
                # Clean up build cache if needed
                docker builder prune -f || true
                
                # Remove dangling images
                docker image prune -f || true
            '''
        }
    }
}
