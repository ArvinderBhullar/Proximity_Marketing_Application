import math

mp = -47
N = 2.75


def DistanceToRSSI(distance):
    return mp - math.log10(distance) * 10 * N


def RSSIToDistance(rssi):
    factor1 = (mp - rssi) / (10 * N)
    return 10**factor1


print("Measured Power = ", mp, ",     N = ", N)
# for i in range(1, 11):
#     rssi = DistanceToRSSI(i)
#     new_d = RSSIToDistance(rssi)distance_to_RSSI.py
#     print(f"Distance: {i}, RSSI: {rssi}, Distance: {new_d}")

print(RSSIToDistance(-47))
print(RSSIToDistance(-55))
print(RSSIToDistance(-68))
print(RSSIToDistance(-74))
