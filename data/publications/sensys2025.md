---
title: "SARLink: Satellite Backscatter Connectivity using Synthetic Aperture Radar"
year: 2025
category: wireless
type: conference
authors:
  - name: "G. Ecola"
    note: "*"
  - name: "B. Yen"
  - name: "A. Morgado"
  - name: "B. Priyantha"
  - name: "R. Chandra"
  - name: "Z. Kapetanovic"
journal: "ACM SenSys"
year_published: 2025
image: "img/publications/2025_sarlink.png"
badges: []
links:
  - icon: "📄"
    text: "PDF"
    url: "https://dl.acm.org/doi/10.1145/3715014.3722061"
---

## Abstract

SARLink is a passive satellite backscatter communication system that uses existing spaceborne synthetic aperture radar (SAR) imaging satellites to provide connectivity in remote regions. It achieves orders of magnitude more range than traditional backscatter systems, enabling communication between a passive ground node and a satellite in low earth orbit. The system is composed of a cooperative ground target, a SAR satellite, and a data processing algorithm. A mechanically modulating reflector was designed to apply amplitude modulation to ambient SAR backscatter signals by changing its radar cross section. These communication bits are extracted from the raw SAR data using an algorithm that leverages subaperture processing to detect multiple bits from a target in a single image dataset. A theoretical analysis of this communication system using on-off keying is presented, including the expected signal model, throughput, and bit error rate. The results suggest a 5.5 ft by 5.5 ft modulating corner reflector could send 60 bits every satellite pass, enough to support low bandwidth sensor data and messages. Using Sentinel-1A, a SAR satellite at an altitude of 693 km, we deployed static and modulating reflectors to evaluate the system. The results, successfully detecting the changing state of a modulating ground target, demonstrate our algorithm's effectiveness for extracting bits, paving the way for ultra-long-range, low-power satellite backscatter communication.

## Author Contributions

**G. Ecola** led the system design, algorithm development, and experimental evaluation. **B. Yen** contributed to hardware development and field deployment. **A. Morgado**, **B. Priyantha**, and **R. Chandra** contributed to system design and analysis. **Z. Kapetanovic** supervised the project. All authors contributed to writing and editing the manuscript.
