import {ScrollView, View} from 'react-native';
import styles from '../cssStyles/styles';
import React, {useState} from 'react';
import {SimCoupon} from '../services/Simulation';
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
import {handleSaveChipPress, Coupon} from '../services/couponService';
type NearestScreenRouteProp = RouteProp<ParamListBase, 'NearestScreen'>;

export interface NearestScreenProps {
  route: NearestScreenRouteProp;
}

const NearestScreen = ({route}: NearestScreenProps) => {
  const [promocode, setPromocode] = useState('');
  const [promoname, setPromoname] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  if (route.params) {
    console.log('routes', route.params['my_coupons']);
    let coupons: SimCoupon[] = route.params['my_coupons'].map(
      (coupon: SimCoupon) => ({
        ...coupon,
        end: new Date(coupon.end), // convert timestamp back to Date
      }),
    );

    const uniqueCoupons: SimCoupon[] = Array.from(
      new Set(coupons.map(coupon => coupon.id)),
    )
      .map(id => {
        return coupons.find(coupon => coupon.id === id);
      })
      .filter(coupon => coupon !== undefined) as SimCoupon[];

    if (uniqueCoupons.length != 0) {
      return (
        <View style={{flex: 1}}>
          <ScrollView testID="nearbyCouponList" style={{flex: 1}}>
            {uniqueCoupons.map(coupon => (
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
                        await handleSaveChipPress(coupon.id);
                      }}>
                      Save
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
        <View testID="nearbyCouponList" style={styles.container}>
          <Text style={styles.title}>No coupons available</Text>
        </View>
      );
    }
  } else {
    return (
      <View testID="nearbyCouponList" style={styles.container}>
        <Text style={styles.title}>Nearest Coupons</Text>
      </View>
    );
  }
};

export default NearestScreen;
