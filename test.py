import pyshark
import datetime
import requests
import json

seen = {}

start = datetime.datetime.now()
period = datetime.timedelta(minutes=1)

def check():
  current_time = datetime.datetime.now()
  global start
  global period

  print current_time - start
  print period
  if current_time - start >= period:
    print "Starting request"

    # Delete old items
    for k in seen.keys():
      if seen[k] <= start:
        del seen[k]
    
    print seen

    # Do POST request
    r = requests.post('http://oneweek-api.herokuapp.com/data', data=json.dumps({'Count': len(seen), 'Latitude': '-10000', 'Longitude': '-10000'}))
    print "Request: '{}'.".format(r)

    start = current_time

    print "Finished request"

while 1:
  capture = pyshark.LiveCapture(interface='en0', display_filter='ssdp')
  capture.sniff(timeout=5)
  for cap in capture:
    current_time = datetime.datetime.now()
    try:
      ip = cap.ip.src
      if ip in seen:
        print "IP address '{}' already seen.".format(ip)
        seen[ip] = current_time
      else:
        print "New IP address '{}'.".format(ip)
      seen[ip] = current_time
    except AttributeError as e:
      pass
    check()
  capture.close()

