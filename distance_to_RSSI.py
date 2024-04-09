import math

mp = -47
N = 2.4


def DistanceToRSSI(distance):
    return mp - math.log10(distance) * 10 * N


def RSSIToDistance(rssi):
    factor1 = (mp - rssi) / (10 * N)
    return 10**factor1


print("Measured Power = ", mp, ",     N = ", N)
for i in range(1, 7):
    rssi = DistanceToRSSI(i)
    new_d = RSSIToDistance(rssi)
    print(f"Distance: {i}, RSSI: {rssi}, Distance: {new_d}")
