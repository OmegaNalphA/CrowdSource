import pyshark
def NetCap():
    print 'capturing...'
    livecapture = pyshark.LiveCapture(interface="eth0", output_file='./test.pcapng')
    livecapture.sniff(timeout=10)
    print 'end of capture.'
    print livecapture

if __name__ == "__main__":
    NetCap()