import * as k8s from "@pulumi/kubernetes";
import * as kx from "@pulumi/kubernetesx";
import * as certManager from "@pulumiverse/kubernetes-cert-manager";

const appLabels = { app: "nginx2" };
const deployment = new k8s.apps.v1.Deployment("nginx2", {
  spec: {
    selector: { matchLabels: appLabels },
    replicas: 1,
    template: {
      metadata: { labels: appLabels },
      spec: { containers: [{ name: "nginx", image: "nginx" }] },
    },
  },
});

export const name = deployment.metadata.name;

const issuer = new certManager.certmanager.v1.Issuer("issuer", {
  metadata: {
    name: "letsencrypt-issuer",
  },
  spec: {
    acme: {
      email: "david@rawkode.com",
      server: "https://acme-staging-v02.api.letsencrypt.org/directory",
      privateKeySecretRef: {
        name: "letsencrypt-staging",
      },
      solvers: [
        {
          http01: {
            ingress: {
              class: "contour",
            },
          },
        },
      ],
    },
  },
});
