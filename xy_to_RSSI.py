import math

get_distance = lambda x1, y1, x2, y2: math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)


def triangulate(closestBeacons):
    beacon1 = closestBeacons[0][1]
    beacon2 = closestBeacons[1][1]
    beacon3 = closestBeacons[2][1]
    beacon1RSSI = closestBeacons[0][0]
    beacon2RSSI = closestBeacons[1][0]
    beacon3RSSI = closestBeacons[2][0]

    dx12 = beacon1.x - beacon2.x
    dy12 = beacon1.y - beacon2.y
    dx21 = beacon2.x**2 - beacon1.x**2
    dy21 = beacon2.y**2 - beacon1.y**2
    dr21 = beacon2.get_r(beacon2RSSI) ** 2 - beacon1.get_r(beacon1RSSI) ** 2

    dx13 = beacon1.x - beacon3.x
    dy13 = beacon1.y - beacon3.y
    dx31 = beacon3.x**2 - beacon1.x**2
    dy31 = beacon3.y**2 - beacon1.y**2
    dr31 = beacon3.get_r(beacon3RSSI) ** 2 - beacon1.get_r(beacon1RSSI) ** 2

    factorA = (dr21 * dx13) / dx12
    factorB = (dx21 * dx13) / dx12
    factorC = (dy21 * dx13) / dx12
    factorD = (dy12 * dx13) / dx12

    y = (dr31 - dy31 - dx31 - factorA + factorB + factorC) / (2 * (dy13 - factorD))
    x = (dr21 - dx21 - dy21 - 2 * y * dy12) / (2 * dx12)
    return [round(x), round(y)]


class Beacon:
    MEASURING_POWER = -47
    N = 2.75

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def get_RSSI(self, distance):
        return Beacon.MEASURING_POWER - math.log10(distance) * 10 * Beacon.N

    def get_distance(self, x, y) -> float:
        return get_distance(self.x, self.y, x, y)

    def get_r(self, rssi):
        return 10 ** ((Beacon.MEASURING_POWER - rssi) / (10 * Beacon.N))


class Cords:
    def __init__(self, x, y):
        self.x = x
        self.y = y


beacon1 = Beacon(0, 0)
beacon2 = Beacon(0, 15)
beacon3 = Beacon(15, 15)
beacon4 = Beacon(15, 0)
beacon5 = Beacon(7.5, 5)

user1 = []

user1.append(Cords(1, 1))
user1.append(Cords(3, 1))
user1.append(Cords(6, 1))
user1.append(Cords(8, 1))
user1.append(Cords(10, 1))
user1.append(Cords(10, 3))
user1.append(Cords(10, 5))
user1.append(Cords(8, 5))
user1.append(Cords(3, 5))
user1.append(Cords(1, 5))
user1.append(Cords(1, 8))
user1.append(Cords(1, 9))
user1.append(Cords(3, 9))
user1.append(Cords(6, 9))
user1.append(Cords(10, 9))
user1.append(Cords(8, 8))
user1.append(Cords(3, 3))

user2 = []

user2.append(Cords(1, 1))
user2.append(Cords(1, 2))
user2.append(Cords(1, 3))
user2.append(Cords(1, 4))
user2.append(Cords(4, 4))
user2.append(Cords(4, 3))
user2.append(Cords(4, 2))

# print("Sim 1")
# for userlocation in user1:
#     beaconRSSI = {}
#     print(f"User location: {userlocation.x}, {userlocation.y}")
#     beaconRSSI[1] = beacon1.get_RSSI(
#         beacon1.get_distance(userlocation.x, userlocation.y)
#     )

#     beaconRSSI[2] = beacon2.get_RSSI(
#         beacon2.get_distance(userlocation.x, userlocation.y)
#     )

#     beaconRSSI[3] = beacon3.get_RSSI(
#         beacon3.get_distance(userlocation.x, userlocation.y)
#     )

#     beaconRSSI[4] = beacon4.get_RSSI(
#         beacon4.get_distance(userlocation.x, userlocation.y)
#     )

#     beaconRSSI[5] = beacon5.get_RSSI(
#         beacon5.get_distance(userlocation.x, userlocation.y)
#     )

# closest beacons to the position RSSI
print("\n\n\n\n\n")
print("SIM 2")
for userlocation in user2:
    beaconRSSI = []
    print(f"User location: {userlocation.x}, {userlocation.y}")
    beaconRSSI.append(
        [
            round(
                beacon1.get_RSSI(beacon1.get_distance(userlocation.x, userlocation.y))
            ),
            beacon1,
        ]
    )

    beaconRSSI.append(
        [
            round(
                beacon2.get_RSSI(beacon2.get_distance(userlocation.x, userlocation.y))
            ),
            beacon2,
        ]
    )
    beaconRSSI.append(
        [
            round(
                beacon3.get_RSSI(beacon3.get_distance(userlocation.x, userlocation.y))
            ),
            beacon3,
        ]
    )
    beaconRSSI.append(
        [
            round(
                beacon4.get_RSSI(beacon4.get_distance(userlocation.x, userlocation.y))
            ),
            beacon4,
        ]
    )
    beaconRSSI.append(
        [
            round(
                beacon5.get_RSSI(beacon5.get_distance(userlocation.x, userlocation.y))
            ),
            beacon5,
        ]
    )

    # closest beacons to the position RSSI
    closest_beacons = sorted(beaconRSSI, key=lambda x: x[0], reverse=True)[:3]
    for i in range(3):
        print(
            f"Beacon {i+1}: {closest_beacons[i][1].x}, {closest_beacons[i][1].y}, RSSI: {closest_beacons[i][0]}"
        )
    print(triangulate(closest_beacons))
