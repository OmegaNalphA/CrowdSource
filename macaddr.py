#!/usr/bin/env python

from uuid import getnode as get_mac
mac_addr = get_mac()
print mac_addr
