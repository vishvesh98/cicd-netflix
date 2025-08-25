pipeline {
    agent any
    
    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository from main branch...'
                git branch: 'main', 
                    url: 'https://github.com/MihirSolankii/Netflix_CI_CD'
            }
        }
        
        stage('Verify Docker') {
            steps {
                echo 'Verifying Docker installation...'
                sh '''
                    docker --version
                    docker compose version
                    docker info
                '''
            }
        }
        
        stage('Stop Existing Services') {
            steps {
                echo 'Stopping any existing services...'
                sh '''
                    docker compose down --volumes || true
                    docker ps -a --format "table {{.Names}}" | grep -E "(netflix|frontend|backend|netdata)" | xargs -r docker rm -f || true
                    docker volume prune -f || true
                '''
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh '''
                    if [ ! -f docker-compose.yml ]; then
                        echo "Error: docker-compose.yml not found!"
                        ls -la
                        exit 1
                    fi
                    
                    echo "Building application images..."
                    docker compose build --no-cache backend frontend
                '''
            }
        }
        
        stage('Start Application Services') {
            steps {
                echo 'Starting application services...'
                sh '''
                    docker compose up -d backend frontend
                    echo "Waiting for application services to start..."
                    sleep 30
                '''
            }
        }
        
        stage('Application Health Check') {
            steps {
                echo 'Performing application health check...'
                sh '''
                    echo "=== Checking backend health ==="
                    timeout 30 bash -c 'until curl -f http://localhost:5000/health || curl -f http://localhost:5000 2>/dev/null; do echo "Waiting for backend..."; sleep 2; done' || echo "Backend health check timeout"
                    
                    echo "=== Checking frontend health ==="
                    timeout 30 bash -c 'until curl -f http://localhost:3000 2>/dev/null; do echo "Waiting for frontend..."; sleep 2; done' || echo "Frontend health check timeout"
                    
                    echo "=== Current container status ==="
                    docker compose ps
                '''
            }
        }
        
        stage('Start Netdata Monitoring') {
            steps {
                echo 'Starting Netdata monitoring...'
                sh '''
                    echo "Starting Netdata container..."
                    docker compose up -d netdata
                    
                    echo "Waiting for Netdata to initialize..."
                    sleep 15
                    
                    echo "=== Verifying Netdata startup ==="
                    docker compose logs netdata | tail -20
                    
                    echo "=== Checking Netdata health ==="
                    timeout 60 bash -c 'until curl -f http://localhost:19999 2>/dev/null; do echo "Waiting for Netdata dashboard..."; sleep 5; done' || echo "Netdata health check timeout"
                '''
            }
        }
        
        stage('Final System Check') {
            steps {
                echo 'Performing final system check...'
                sh '''
                    echo "=== All containers status ==="
                    docker compose ps
                    
                    echo "=== Docker system status ==="
                    docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
                    
                    echo "=== Netdata monitoring status ==="
                    if curl -s http://localhost:19999/api/v1/info | grep -q "version"; then
                        echo "✅ Netdata is successfully monitoring the system"
                        echo "🌐 Access dashboard at: http://localhost:19999"
                    else
                        echo "⚠️  Netdata might not be fully ready yet"
                    fi
                    
                    echo "=== Application accessibility ==="
                    echo "🎬 Frontend: http://localhost:3000"
                    echo "🔧 Backend: http://localhost:5000"
                    echo "📊 Netdata: http://localhost:19999"
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
            sh '''
                echo "=== Final System Overview ==="
                docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}" || true
                
                echo "=== Resource Usage ==="
                docker stats --no-stream --format "table {{.Container}}\\t{{.CPUPerc}}\\t{{.MemUsage}}" || true
            '''
        }
        success {
            echo 'Pipeline completed successfully! 🎉'
            sh '''
                echo "=== Deployment Summary ==="
                echo "✅ All services are running successfully"
                echo "🎬 Netflix App: http://localhost:3000"
                echo "🔧 Backend API: http://localhost:5000"
                echo "📊 Netdata Dashboard: http://localhost:19999"
                echo ""
                echo "=== Container Status ==="
                docker compose ps || true
            '''
        }
        failure {
            echo 'Pipeline failed. Gathering diagnostic information...'
            sh '''
                echo "=== Container Status ==="
                docker compose ps || true
                
                echo "=== Container Logs ==="
                echo "--- Backend Logs ---"
                docker compose logs --tail=50 backend || true
                echo "--- Frontend Logs ---"
                docker compose logs --tail=50 frontend || true
                echo "--- Netdata Logs ---"
                docker compose logs --tail=50 netdata || true
                
                echo "=== System Resources ==="
                df -h || true
                free -h || true
                
                echo "=== Cleaning up failed deployment ==="
                docker compose down --volumes || true
            '''
        }
    }
}
