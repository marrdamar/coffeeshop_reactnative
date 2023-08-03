/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';

const authStyle = StyleSheet.create({
  bgAuth: {
    flex: 1,
    resizeMode: 'cover',
  },
  mainAuth: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  authTitle: {
    marginTop: 100,
    fontSize: 65,
    fontWeight: 700,
    textAlign: 'center',
    color: 'white',
  },
  authTitleCode: {
    marginTop: 10,
    fontSize: 65,
    fontWeight: 700,
    textAlign: 'center',
    color: 'white',
  },
  authDesc: {
    maxWidth: '80%',
    marginTop: 12,
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
  },
  inputAuth: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    fontWeight: 'bold',
    color: 'white',
  },
  btnContainer: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
});

export default authStyle;
