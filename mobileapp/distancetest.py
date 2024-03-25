#  return Math.pow(
#       10,
#       (BLEDevice.MEASURING_POWER - this.getRSSIAvg()) / (10 * BLEDevice.N),
#     );

N = 2
RSSI_MEASURED = -69
RSSI_AT_ONE = -69

D = 10 ** ((RSSI_AT_ONE - RSSI_MEASURED) / (10 * N))
print(D)