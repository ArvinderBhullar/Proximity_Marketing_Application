import math

N = 2.75
RSSI_AT_ONE = -47

def dtoRSSI(d):
    return RSSI_AT_ONE - math.log(d, 10) * 10 *N

def RSSItod(rssi):
    D = 10 ** ((RSSI_AT_ONE - rssi) / (10 * N))
    return D




for i in range(1,7):
    rssi =dtoRSSI(i)
    print("rssi", rssi, "distance", RSSItod(rssi))
