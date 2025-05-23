import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaeaea',
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0bb3e0',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    fontSize: 15,
    color: '#ffffff',
  },
  input: {
    margin: 5,
    padding: 10,
    color: '#000000',
    fontSize: 15,
    backgroundColor: '#ffffff',
  },
  couponItem: {
    marginBottom: 15,
    padding: 30,
    borderRadius: 8,
    height: 150,
  },
  couponTitle: {
    color: 'white',
    fontSize: 20,
  },
  couponDate: {
    color: 'white',
    fontSize: 10,
  },
});

export default styles;
