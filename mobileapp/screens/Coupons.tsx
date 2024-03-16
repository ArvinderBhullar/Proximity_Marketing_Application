import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Modal, Button} from 'react-native';
import {db} from '../services/Config';
import {query, collection, getDocs, DocumentData} from 'firebase/firestore';
import {Timestamp} from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';
import styles from '../cssStyles/styles';
import LinearGradient from 'react-native-linear-gradient';
interface Coupon {
  name: string;
  end: Timestamp;
  description: string;
}

const Coupons = () => {
  const [coupons, setCoupons] = useState<DocumentData[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCoupons = async () => {
    const q = query(collection(db, 'Coupons'));

    const querySnapshot = await getDocs(q);
    const fetchedCoupons: Coupon[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as Coupon; // Assuming your document data matches the Coupon interface
      return {...data, id: doc.id};
    });
    setCoupons(fetchedCoupons);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // const openModal = (coupon) => {
  //   setSelectedCoupon(coupon);
  //   setModalVisible(true);
  // };
  //
  // const closeModal = () => {
  //   setSelectedCoupon(null);
  //   setModalVisible(false);
  // };

  return (
    <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
      {coupons.map(coupon => (
        <TouchableOpacity key={coupon.id}>
          <LinearGradient
            colors={['#9ACEEB', '#000000']}
            style={styles.couponItem}>
            <Text style={styles.couponTitle}>{coupon.name}</Text>
            {/*<Text>{coupon.end}</Text>*/}
            <Text style={styles.couponDate}>
              {new Date(coupon.end.seconds * 1000).toLocaleDateString()}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}

      {/*<Modal*/}
      {/*  visible={modalVisible}*/}
      {/*  animationType="slide"*/}
      {/*  onRequestClose={closeModal}>*/}
      {/*  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>*/}
      {/*    {selectedCoupon && (*/}
      {/*      <View>*/}
      {/*        <Text>{selectedCoupon.name}</Text>*/}
      {/*        <Text>{selectedCoupon.end}</Text>*/}
      {/*        <Text>{selectedCoupon.description}</Text>*/}
      {/*        <Button title="Redeem" onPress={closeModal} />*/}
      {/*        <Button title="Close" onPress={closeModal} />*/}
      {/*      </View>*/}
      {/*    )}*/}
      {/*  </View>*/}
      {/*</Modal>*/}
    </View>
  );
};

export default Coupons;
