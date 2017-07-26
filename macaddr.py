import pyshark

def NetCap():
    print 'capturing...'
    livecapture = pyshark.LiveCapture()
    livecapture.sniff(timeout=10)
    print 'end of capture.'
    print livecapture

if __name__ == "__main__":
    NetCap()