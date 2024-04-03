import math

mp = -37
N = -5


def DistanceToRSSI(distance):
    return (10 * N * math.log(distance, 10)) + mp


def RSSIToDistance(rssi):
    factor1 = (rssi - mp) / (10 * N)
    return 10**factor1


def findN(rssi, distance):
    return (rssi - mp) / (10 * math.log(distance, 10))


for i in range(1, 7):
    rssi = DistanceToRSSI(i)
    new_d = RSSIToDistance(rssi)
    if new_d > 1:
        print("N = ", findN(rssi, new_d))
    print(f"Distance: {i}, RSSI: {rssi}, Distance: {new_d}")
