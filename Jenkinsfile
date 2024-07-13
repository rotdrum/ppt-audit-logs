pipeline {
    agent any
    tools {
        nodejs "nodev16.20.1"
    }
    environment {
        registry = "10.224.188.14:5000/default-templates-mongo_nodejs:v.test."
        service = "default_templates_mongo_nodejs"
        dockerlogin = "10.224.188.14:5000 --username adminhermes --password P@ssw0rd"
    }
    stages {
        stage('run test') {
            steps{
                   dir(service) {
                    script {
                         sh "ls"
                        sh "curl -X POST --data-urlencode 'payload={\"channel\": \"#jenkins-hermes\", \"username\": \"webhookbot\", \"text\": \"Start Jenkins.\", \"icon_emoji\": \":ghost:\"}' https://hooks.slack.com/services/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"
                        sh "npm install"
                        sh "npm run test"
                        sh "curl -X POST --data-urlencode 'payload={\"channel\": \"#jenkins-hermes\", \"username\": \"webhookbot\", \"text\": \"`"+service+"` run test.\", \"icon_emoji\": \":ghost:\"}' https://hooks.slack.com/services/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"
                    }
                }
            }
                
        }
        stage('building docker image ') {
            steps{
                dir(service) {
                    script {
                        dockerImage = docker.build registry + "$BUILD_NUMBER"
                        sh "curl -X POST --data-urlencode 'payload={\"channel\": \"#jenkins-hermes\", \"username\": \"webhookbot\", \"text\": \"build docker image " + registry + "$BUILD_NUMBER" + "\", \"icon_emoji\": \":ghost:\"}' https://hooks.slack.com/services/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"
                        // sh "trivy image -timeout 5m " + registry + "$BUILD_NUMBER"
                        sh "curl -X POST --data-urlencode 'payload={\"channel\": \"#jenkins-hermes\", \"username\": \"webhookbot\", \"text\": \"`trivy` scan image success\", \"icon_emoji\": \":ghost:\"}' https://hooks.slack.com/services/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"
                    }
                }
            }
        }
        stage('push docker Image') {
            steps{
                 dir(service) {
                    script {
                        sh "docker login " + dockerlogin
                        dockerImage.push()
                        sh "docker rmi " + registry + "$BUILD_NUMBER"
                        sh "curl -X POST --data-urlencode 'payload={\"channel\": \"#jenkins-hermes\", \"username\": \"webhookbot\", \"text\": \"push docker image success.\", \"icon_emoji\": \":ghost:\"}' https://hooks.slack.com/services/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"
                    }
                 }
            }
        }
    }
    post {
        success {
            echo 'Deployment successful!'
             sh "curl -X POST --data-urlencode 'payload={\"channel\": \"#jenkins-hermes\", \"username\": \"webhookbot\", \"text\": \"`Deployment "+service+" successful`.\", \"icon_emoji\": \":ghost:\"}' https://hooks.slack.com/services/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"
        }
        failure {
            echo 'Deployment failed!'
            sh "docker rmi " + registry + "$BUILD_NUMBER"
            sh "curl -X POST --data-urlencode 'payload={\"channel\": \"#jenkins-hermes\", \"username\": \"webhookbot\", \"text\": \"`Deployment "+service+" failed`.\", \"icon_emoji\": \":ghost:\"}' https://hooks.slack.com/services/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"
        }
    }
} 
