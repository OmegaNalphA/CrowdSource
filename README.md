# CrowdSource
Built for One Week Hack at MSFT 2017. Use any (public or encrypted) WiFi to track number of users in an area, even those not on the wifi, and display it on a beautiful D3 interface. portable to Raspberry Pi 3. 

This script utilizes pyshark to analyze the network data. Taking advantage of the SSDP requests that all devices send at consistent intervals, we create a heatmap of what the congestion at those locations look like

## To Implement
* get PyShark
```python
pip install pyshark
```
* Connect your device to the wifi you would like to monitor
* run the script in the background, and check the results on the webclient