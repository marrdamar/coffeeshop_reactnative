// import React from 'react';
// import {HStack, Spinner} from 'native-base';

// const LoaderSpin = () => {
//   return (
//     <HStack
//       space={8}
//       justifyContent="center"
//       alignItems="center"
//       marginTop={40}>
//       <Spinner size="lg" />
//     </HStack>
//   );
// };

// export default LoaderSpin;

import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const LoaderSpin = () => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="large" color="#6A4029" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // marginTop: 60,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default LoaderSpin;
