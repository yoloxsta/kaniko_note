pipeline {
    agent {
        kubernetes {
            yaml """
kind: Pod
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    imagePullPolicy: Always
    command:
    - sleep
    args:
    - 9999999
    volumeMounts:
      - name: jenkins-docker-cfg
        mountPath: /kaniko/.docker
  - name: google-cloud-sdk
    image: google/cloud-sdk
    imagePullPolicy: Always
    command:
    - sleep
    args:
    - 9999999
  volumes:
  - name: jenkins-docker-cfg
    projected:
      sources:
      - secret:
          name: regcredsta
          items:
            - key: .dockerconfigjson
              path: config.json
"""
        }
    }

    environment {
        BACKEND_IMAGE = "your-dockerhub-username/hello-world-backend"
        FRONTEND_IMAGE = "your-dockerhub-username/hello-world-frontend"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Clone repository') {
            steps {
                checkout scm
            }
        }

        stage('Build and Push Backend Image') {
            steps {
                container(name: 'kaniko', shell: '/busybox/sh') {
                    sh '''#!/busybox/sh
                        /kaniko/executor --context `pwd`/backend --dockerfile Dockerfile --destination $BACKEND_IMAGE:$IMAGE_TAG --destination $BACKEND_IMAGE:latest
                    '''
                }
            }
        }

        stage('Build and Push Frontend Image') {
            steps {
                container(name: 'kaniko', shell: '/busybox/sh') {
                    sh '''#!/busybox/sh
                        /kaniko/executor --context `pwd`/frontend --dockerfile Dockerfile --destination $FRONTEND_IMAGE:$IMAGE_TAG --destination $FRONTEND_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container(name: 'google-cloud-sdk', shell: '/bin/bash') {
                    sh '''
                    # Update deployment.yaml with new image tags
                    sed -i 's|image: your-dockerhub-username/hello-world-backend:.*|image: your-dockerhub-username/hello-world-backend:'"$IMAGE_TAG"'|g' k8s/deployment.yaml
                    sed -i 's|image: your-dockerhub-username/hello-world-frontend:.*|image: your-dockerhub-username/hello-world-frontend:'"$IMAGE_TAG"'|g' k8s/deployment.yaml
                    
                    # Apply the deployment to Kubernetes
                    kubectl apply -f k8s/deployment.yaml
                    '''
                }
            }
        }
    }
}
