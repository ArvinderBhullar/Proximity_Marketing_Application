import math

get_distance = lambda x1, y1, x2, y2: math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)


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

print("Sim 1")
for userlocation in user1:
    beaconRSSI = {}
    print(f"User location: {userlocation.x}, {userlocation.y}")
    beaconRSSI[1] = beacon1.get_RSSI(
        beacon1.get_distance(userlocation.x, userlocation.y)
    )

    beaconRSSI[2] = beacon2.get_RSSI(
        beacon2.get_distance(userlocation.x, userlocation.y)
    )

    beaconRSSI[3] = beacon3.get_RSSI(
        beacon3.get_distance(userlocation.x, userlocation.y)
    )

    beaconRSSI[4] = beacon4.get_RSSI(
        beacon4.get_distance(userlocation.x, userlocation.y)
    )

    beaconRSSI[5] = beacon5.get_RSSI(
        beacon5.get_distance(userlocation.x, userlocation.y)
    )

    # closest beacons to the position RSSI
print("\n\n\n\n\n")
print("SIM 2")
for userlocation in user2:
    beaconRSSI = []
    print(f"User location: {userlocation.x}, {userlocation.y}")
    beaconRSSI.append(
        beacon1.get_RSSI(beacon1.get_distance(userlocation.x, userlocation.y))
    )
    beaconRSSI.append(
        beacon2.get_RSSI(beacon2.get_distance(userlocation.x, userlocation.y))
    )
    beaconRSSI.append(
        beacon3.get_RSSI(beacon3.get_distance(userlocation.x, userlocation.y))
    )
    beaconRSSI.append(
        beacon4.get_RSSI(beacon4.get_distance(userlocation.x, userlocation.y))
    )
    beaconRSSI.append(
        beacon5.get_RSSI(beacon5.get_distance(userlocation.x, userlocation.y))
    )
    print(f"Beacon 1 RSSI: {beaconRSSI[0]}")
    print(f"Beacon 2 RSSI: {beaconRSSI[1]}")
    print(f"Beacon 3 RSSI: {beaconRSSI[2]}")
    print(f"Beacon 4 RSSI: {beaconRSSI[3]}")
    print(f"Beacon 5 RSSI: {beaconRSSI[4]}")
