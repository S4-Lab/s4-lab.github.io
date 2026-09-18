---
title: "Fall-Curve: A Novel Primitive for IoT Fault Detection and Isolation"
year: 2018
category: environment
type: conference
authors:
  - name: "T. Chakraborty"
  - name: "A.U. Nambi"
  - name: "R. Chandra"
  - name: "R. Sharma"
  - name: "M. Swaminathan"
  - name: "Z. Kapetanovic"
  - name: "J. Appavoo"
journal: "ACM SenSys"
pages: "95–107"
year_published: 2018
image: "img/publications/2018_sensys.png"
badges: []
links:
  - icon: "📄"
    text: "Paper"
    url: "https://doi.org/10.1145/3274783.3274853"
---

## Abstract

The proliferation of Internet of Things (IoT) devices has led to the deployment of various types of sensors in the homes, offices, buildings, lawns, cities, and even in agricultural farms. Since IoT applications rely on the fidelity of data reported by the sensors, it is important to detect a faulty sensor and isolate the cause of the fault. Existing fault detection techniques demand sensor domain knowledge along with the contextual information and historical data from similar near-by sensors. However, detecting a sensor fault by analyzing just the sensor data is non-trivial since a faulty sensor reading could mimic non-faulty sensor data. This paper presents a novel primitive, which we call the Fall-curve - a sensor's voltage response when the power is turned off - that can be used to characterize sensor faults. The Fall-curve constitutes a unique signature independent of the phenomenon being monitored which can be used to identify the sensor and determine whether the sensor is correctly operating.

We have empirically evaluated the Fall-curve technique on a wide variety of analog and digital sensors. We have also been running this system live in a few agricultural farms, with over 20 IoT devices. We were able to detect and isolate faults with an accuracy over 99%, which would have otherwise been hard to detect only by observing measured sensor data.
