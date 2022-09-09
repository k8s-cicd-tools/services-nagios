import * as k8s from "@pulumi/kubernetes";
import * as kx from "@pulumi/kubernetesx";

const appLabels = { app: "nagios-core" };
const deployment = new  k8s.apps.v1.Deployment("nagios-deployment", {
    metadata: {
        namespace: "monitoring",
        name: "nagios-deployment"
    },
    spec: {
        replicas: 1,
        selector: { matchLabels: appLabels },
        template: {
            metadata: { labels: appLabels },
            spec: {
                containers: [{
                    name: "nagios-container",
                    image: "jasonrivers/nagios",
                    ports: [{ containerPort: 80, protocol: "TCP", name: "nagios-port" }]
                }]
            }
        }
    }
});


const service = new k8s.core.v1.Service("nagios-service", {
    metadata: {
        namespace: "monitoring",
        name: "nagios-service"
    },
    spec: {
        type: "NodePort",
        selector: { app: "nagios-core" },
        ports: [{ port: 80, targetPort: 80, nodePort: 30008 }]
    }
});


export const name = deployment.metadata.name;
