---
title: "Hypercam: Low-power Onboard Computer Vision for IoT Cameras"
year: 2025
category: computing
type: conference
authors:
  - name: "C. Lee"
    note: "*"
  - name: "L. Yi"
  - name: "M. Fite"
  - name: "T. Rao"
  - name: "S. Achour"
  - name: "Z. Kapetanovic"
journal: "ACM MobiCom"
year_published: 2025
image: "img/publications/2025_hypercam.png"
badges: []
links:
  - icon: "📄"
    text: "PDF"
    url: "https://static1.squarespace.com/static/5dbfa469f492b24b4fe947ce/t/67633f8a8fe5252bbb2f51b8/1734557581523/Hypercam_PDF.pdf"
  - icon: "💻"
    text: "Code"
    url: "https://www.github.com/S4-Lab/HyperCam/"
---

## Abstract

We present HyperCam, an energy-efficient image classification pipeline that enables computer vision tasks onboard low-power IoT camera systems. HyperCam leverages hyperdimensional computing-based techniques to perform both training and inference efficiently on low-power microcontrollers. We implement a low-power wireless camera platform using off-the-shelf hardware and demonstrate that HyperCam can achieve an accuracy of 93.60%, 84.06%, 92.98%, and 72.79% for MNIST, Fashion-MNIST, Face Detection, and Face Identification tasks, respectively, for 120x160 resolution grayscale images. HyperCam performs classification with inference latency of 0.12 s, flash memory usage of about 60 kilobytes, and peak RAM usage of about 20 kilobytes. Among other machine learning classifiers such as SVM, xgBoost, MicroNets, MobileNetV3, and MCUNetV3, HyperCam is the only classifier that achieves competitive accuracy while maintaining competitive memory footprint and inference latency on 4 benchmark tasks.

## Author Contributions

**C. Lee** led system design, implementation, and evaluation. **L. Yi**, **M. Fite**, and **T. Rao** contributed to hardware and software development. **S. Achour** contributed to the hyperdimensional computing methodology. **Z. Kapetanovic** supervised the project. All authors contributed to writing and editing the manuscript.
