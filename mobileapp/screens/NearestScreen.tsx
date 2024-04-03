import {ScrollView, View} from 'react-native';
import styles from '../cssStyles/styles';
import React, {useState} from 'react';
import {Coupon} from './NotifyScreen';
import {RouteProp} from '@react-navigation/native';
import {ParamListBase} from '@react-navigation/routers';
import {auth, db} from '../services/Config';
import {
  Card,
  Title,
  Paragraph,
  Text,
  Chip,
  Button,
  Modal,
  Portal,
} from 'react-native-paper';
import {collection, getDocs} from 'firebase/firestore';
import {handleRedeemChipPress} from '../services/couponService';
type NearestScreenRouteProp = RouteProp<ParamListBase, 'NearestScreen'>;

export interface NearestScreenProps {
  route: NearestScreenRouteProp;
}

const compareDB = async (coupons: Coupon[]) => {
  const user = auth.currentUser;
  const redemptionsQuerySnapshot = await getDocs(collection(db, 'Redemptions'));

  class Redemption {
    userId: string;
    couponId: string;
    redeemedAt: string;

    constructor(userId: string, couponId: string, redeemedAt: string) {
      this.userId = userId;
      this.couponId = couponId;
      this.redeemedAt = redeemedAt;
    }
  }
  const tempRedemption: Redemption[] = [];
  redemptionsQuerySnapshot.forEach(doc => {
    const data = doc.data();
    tempRedemption.push(
      new Redemption(data.userId, data.couponId, data.redeemedAt),
    );
  });

  coupons = coupons.filter(coupon => {
    const isRedeemed = tempRedemption.some(
      redemption =>
        redemption.couponId === coupon.id && redemption.userId === user!.uid,
    );
    return !isRedeemed;
  });

  return coupons;
};

const NearestScreen = ({route}: NearestScreenProps) => {
  const [promocode, setPromocode] = useState('');
  const [promoname, setPromoname] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  if (route.params) {
    let coupons: Coupon[] = route.params['nearestCoupons'].map(
      (coupon: Coupon) => ({
        ...coupon,
        end: new Date(coupon.end), // convert timestamp back to Date
      }),
    );

    // coupons = compareDB(coupons);
    console.log(coupons);
    if (coupons.length != 0) {
      return (
        <View style={{flex: 1}}>
          <ScrollView style={{flex: 1}}>
            {coupons.map(coupon => (
              <Card key={coupon.id} style={{margin: 10}}>
                <Card.Content>
                  <Title>{coupon.name}</Title>
                  <Paragraph>{coupon.description}</Paragraph>
                  <Text>
                    Expires: {new Date(Number(coupon.end)).toLocaleDateString()}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <Chip
                      icon="gift"
                      mode="outlined"
                      onPress={async () => {
                        await handleRedeemChipPress(
                          coupon.id,
                          coupon.name,
                          coupon.promocode,
                          setPromocode,
                          setPromoname,
                          setPopupVisible,
                        );
                      }}>
                      Redeem
                    </Chip>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
          <Portal>
            <Modal
              visible={popupVisible}
              onDismiss={() => setPopupVisible(false)}
              contentContainerStyle={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
              }}>
              <Text>Promotion: {promoname}</Text>
              <Text>Promo code: {promocode}</Text>
              <Button
                onPress={() => {
                  setPopupVisible(false);
                }}>
                Close
              </Button>
            </Modal>
          </Portal>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>No coupons available</Text>
        </View>
      );
    }
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nearest Coupons</Text>
      </View>
    );
  }
};

export default NearestScreen;
