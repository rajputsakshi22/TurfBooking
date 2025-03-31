import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
// const YourComponent = () => {
const Notice = () => {
  const payloadList = {
    issueid: 1,
    userName: 'John Doe',
    contact: '9172452424',
    mailId: 'john.doe@example.com',
    issue: 'Example Issue for turf',
    status: 'Resolved',
  };

  return (
    <View style={styles.mainContainer}>
      {/* Existing JSX structure */}
      <View style={styles.payloadRow}>
        <Text style={styles.Text}>Add Notice</Text>
        <View style={styles.flatStyle} key={payloadList.issueid}>
          <View style={{flexDirection: 'row', padding: 4}}>
            <Text
              style={{
                color: '#010048',
                fontSize: 16,
                fontFamily: 'Roboto-Medium',
                fontWeight: '700',
              }}>
              {payloadList.userName}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              padding: 4,
            }}>
            <View>
              <Text
                style={{
                  color: '#142d73',
                  fontWeight: '600',
                  fontSize: 12,
                  fontFamily: 'Roboto-Medium',
                  textAlign: 'center',
                }}>
                {payloadList.contact}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  color: '#00264d',
                  fontWeight: '600',
                  fontSize: 12,
                  fontFamily: 'Roboto-Medium',
                  textAlign: 'center',
                }}>
                {payloadList.mailId}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              padding: 4,
            }}>
            <View>
              <Text
                style={{
                  color: '#010048',
                  fontSize: 16,
                  fontFamily: 'Roboto-Medium',
                  fontWeight: '700',
                }}>
                {payloadList.issue}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  color: '#010048',
                  fontSize: 16,
                  fontFamily: 'Roboto-Medium',
                  fontWeight: '700',
                }}>
                {payloadList.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.payloadRow}>
        <View style={styles.flatStyle} key={payloadList.issueid}>
          <View style={{flexDirection: 'row', padding: 4}}>
            <Text
              style={{
                color: '#010048',
                fontSize: 16,
                fontFamily: 'Roboto-Medium',
                fontWeight: '700',
              }}>
              {payloadList.userName}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              padding: 4,
            }}>
            <View>
              <Text
                style={{
                  color: '#142d73',
                  fontWeight: '600',
                  fontSize: 12,
                  fontFamily: 'Roboto-Medium',
                  textAlign: 'center',
                }}>
                {payloadList.contact}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  color: '#00264d',
                  fontWeight: '600',
                  fontSize: 12,
                  fontFamily: 'Roboto-Medium',
                  textAlign: 'center',
                }}>
                {payloadList.mailId}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              padding: 4,
            }}>
            <View>
              <Text
                style={{
                  color: '#010048',
                  fontSize: 16,
                  fontFamily: 'Roboto-Medium',
                  fontWeight: '700',
                }}>
                {payloadList.issue}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  color: '#010048',
                  fontSize: 16,
                  fontFamily: 'Roboto-Medium',
                  fontWeight: '700',
                }}>
                {payloadList.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.payloadRow}>
        <View style={styles.flatStyle} key={payloadList.issueid}>
          <View style={{flexDirection: 'row', padding: 4}}>
            <Text
              style={{
                color: '#010048',
                fontSize: 16,
                fontFamily: 'Roboto-Medium',
                fontWeight: '700',
              }}>
              {payloadList.userName}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              padding: 4,
            }}>
            <View>
              <Text
                style={{
                  color: '#142d73',
                  fontWeight: '600',
                  fontSize: 12,
                  fontFamily: 'Roboto-Medium',
                  textAlign: 'center',
                }}>
                {payloadList.contact}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  color: '#00264d',
                  fontWeight: '600',
                  fontSize: 12,
                  fontFamily: 'Roboto-Medium',
                  textAlign: 'center',
                }}>
                {payloadList.mailId}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              padding: 4,
            }}>
            <View>
              <Text
                style={{
                  color: '#010048',
                  fontSize: 16,
                  fontFamily: 'Roboto-Medium',
                  fontWeight: '700',
                }}>
                {payloadList.issue}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  color: '#010048',
                  fontSize: 16,
                  fontFamily: 'Roboto-Medium',
                  fontWeight: '700',
                }}>
                {payloadList.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  payloadRow: {
    marginBottom: 20,
  },
  flatStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  Text: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#0039a6',
    fontWeight: '900',
    top: -10,
  },
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  noticeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Notice;
