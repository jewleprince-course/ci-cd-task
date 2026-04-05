pipeline {
    agent any

    environment {
        KEY_PATH = "/var/lib/jenkins/devopskey.pem"
    }

    stages {

        stage('Checkout code') {
            steps {
                git branch: 'main', url: ''
            }
        }

        stage('Terraform Init') {
            steps {
                dir('terraform') {
                    sh 'terraform init'
                }
            }
        }

        stage('Terraform apply') {
            steps {
                dir('terraform') {
                    sh 'terraform apply --auto-approve'
                }
            }
        }

        stage('Get Server IP') {
            steps {
                dir('terraform') {
                    script {
                        env.SERVER_IP = sh (
                            script: "terraform output -raw public_ip"
                            returnStdout: true
                        ).trim()
                    }
                }
                echo "Server IP is  ${SERVER_IP
                }"
            }
        }

        stage('Wait for server to be ready') {
            steps {
                echo "Waiting for EC2 instance to finish booting..."
                sh 'sleep 60'
            }
        }

        stage('Deploy website') {
            steps {
                sh """
                scp -r -i ${KEY_PATH} -o StrictHostKeyChecking=no website/* ubuntu@${SERVER_IP}:/tmp/
                """

                sh """
                ssh -i ${KEY_PATH} -o StrictHostKeyChecking=no ubuntu@${SERVER_IP}
                sudo rm -rf /var/www/html/* && 
                sudo mv /tmp/* /var/www/html/ && 
                sudo systemctl restart nginx
                """
            }
        }
    }

    post {
        success {
            echo "Deployment successful! Visit: http://${SERVER_IP}"
        }
        failure {
            echo "Pipeline failed. Check logs above."
        }
    }
}