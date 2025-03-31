import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getFindGame} from '../../Service/UserAPI/getFindGame';
import DataIsNotPresent from '../Admin/DataIsNotPresent.jpg';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Image} from 'react-native';
import {useRoute} from '@react-navigation/native';
import getFindPlayers from '../../Service/UserAPI/getFindPlayers';

const TeamCard = ({team}) => (
  <View style={styles.card}>
    <View style={{alignItems: 'center'}}>
      <Image
        style={{
          width: '100%',
          height: '80%',
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
        source={require('../User/img1.jpg')}
      />
    </View>
    <View style={{flexDirection: 'row'}}>
      <Text style={styles.cardTitle}>{team.name}</Text>
    </View>
    <View style={{flexDirection: 'row', gap: -10}}>
      <MaterialIcons
        name="sports-handball"
        color={'#000'}
        size={15}
        style={{top: -16, marginLeft: 20}}
      />
      <Text style={styles.cardTitle}>{team.sport}</Text>
    </View>
  </View>
);

const CreateGames = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('FindTeam');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [teamResults, setTeamResults] = useState([]);
  const [error, setError] = useState(null);
  const [payloadList, setPayloadList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    getListForPlayer(1);
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={{flexDirection: 'row', gap: 10, margin: 3}}>
        <Icon name="user" size={16} color="green" style={styles.icon} />
        <Text style={styles.name}>{item.customerName}</Text>
      </View>

      {/* Row for Email with Icon */}
      <View style={{flexDirection: 'row', gap: 10, margin: 3}}>
        <Icon name="envelope" size={16} color="green" style={styles.icon} />
        <Text style={styles.name}>{item.email}</Text>
      </View>

      {/* Row for Phone with Icon */}
      <View style={{flexDirection: 'row', gap: 10, margin: 3}}>
        <Icon name="phone" size={16} color="green" style={styles.icon} />
        <Text style={styles.name}>{item.phoneNo}</Text>
      </View>
    </View>
  );

  useEffect(() => {
    getListForPlayer(1); // Start from page 1
  }, []);
  const getListForPlayer = async page => {
    setLoading(true);
    try {
      // Ensure the promise is awaited
      const response = await getFindPlayers(page - 1); // Fetch players data from API

      // Log the full response to verify structure
      console.log('Full API Response:', response);

      // Ensure that `response.data` exists and check for `content`
      const data = response?.data;

      // Log `data` to understand its structure
      console.log('API Response Data:', data);

      // Check if `content` exists, if not handle it gracefully
      if (data && data.content) {
        // Log the correct data structure
        console.log('API Response Content:', data.content);

        // Update payload list
        setPayloadList(prevList =>
          page === 1 ? data.content : [...prevList, ...data.content],
        );

        // Update pagination-related state
        setHasMore(data.content.length === itemsPerPage);
        setCurrentPage(page + 1);
      } else {
        throw new Error('API response does not contain "content"');
      }
    } catch (error) {
      console.error('Error fetching API Response:', error);
      setError(error); // Set error state to handle it in UI
    } finally {
      setLoading(false);
    }
  };
  const handleNextPage = () => {
    if (!loading && hasMore) {
      loadPayloadList(currentPage, searchKeyword);
    }
  };

  const route = useRoute();
  const sportlist = route.params.sportlist;
  const turfId = route.params.turfId;

  useEffect(() => {
    if (searchKeyword) {
      loadPayloadList(searchKeyword);
    }
  }, [searchKeyword]);

  const handleSearch = keyword => {
    setSearchKeyword(keyword);
  };

  const loadPayloadList = async (game = '') => {
    setLoading(true);
    try {
      const response = await getFindGame(game);
      setTeamResults(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = tabName => {
    setActiveTab(tabName);
  };

  const renderContent = () => {
    if (activeTab === 'FindTeam') {
      return (
        <>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={teamResults}
              keyExtractor={item =>
                item.id ? item.id.toString() : 'defaultKey'
              }
              renderItem={({item}) => <TeamCard team={item} />}
              contentContainerStyle={styles.contentContainer}
              ListEmptyComponent={
                <View style={styles.imageContainer}>
                  <Text style={styles.textItem}>Data is not present</Text>
                  <Image source={DataIsNotPresent} style={styles.imageStyle} />
                </View>
              }
            />
          )}
          <View style={styles.containerplus}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() =>
                navigation.navigate('GameAdded', {
                  sportlist: sportlist,
                  turfId: turfId,
                })
              }>
              <Icon name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      );
    }

    if (activeTab === 'FindPlayers') {
      return (
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text>Error: {error.message}</Text>
          ) : (
            <FlatList
              data={payloadList}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              onEndReached={() => {
                if (hasMore) {
                  getListForPlayer(currentPage);
                }
              }}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
      );
    }

    return <Text style={styles.Text3}>Please select a valid tab.</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            activeTab === 'FindTeam' && styles.activeTab,
          ]}
          onPress={() => handleTabPress('FindTeam')}>
          <MaterialCommunityIcons
            name="account-group-outline"
            color={activeTab === 'FindTeam' ? '#fff' : 'green'}
            size={15}
          />
          <Text
            style={[
              styles.Text3,
              {fontSize: 12, fontWeight: 'bold'},
              activeTab === 'FindTeam' && styles.activeText,
            ]}>
            Find Game
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionCard,
            activeTab === 'FindPlayers' && styles.activeTab,
          ]}
          onPress={() => handleTabPress('FindPlayers')}>
          <MaterialCommunityIcons
            name="soccer"
            color={activeTab === 'FindPlayers' ? '#fff' : 'green'}
            size={15}
          />
          <Text
            style={[
              styles.Text3,
              {fontSize: 12, fontWeight: 'bold'},
              activeTab === 'FindPlayers' && styles.activeText,
            ]}>
            Find Players
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <FontAwesome5
          name="search"
          size={18}
          color="#ff6600"
          style={{marginLeft: 18, marginRight: 10}}
        />
        <TextInput
          style={{
            width: '70%',
            color: '#010048',
            fontSize: 16,
            paddingVertical: 8,
          }}
          placeholder="Search For Games"
          placeholderTextColor="#aaa"
          value={searchKeyword}
          onChangeText={handleSearch}
        />
      </View>
      {renderContent()}
    </View>
  );
};

export default CreateGames;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    width: '50%',
  },
  activeTab: {
    backgroundColor: '#ED6B05',
  },
  activeText: {
    color: '#fff',
  },
  Text3: {
    fontSize: 14,
    color: '#000',
  },
  contentContainer: {
    flex: 1,
    margin: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'green',
    shadowColor: 'green',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 11.55,
    elevation: 2,
    padding: 10,
    margin: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    top: -20,
    marginLeft: 20,
    color: '#000',
  },
  cardSubtitle: {
    fontSize: 14,
    marginLeft: 10,
    color: '#000',
  },
  cardSubtitle1: {
    fontSize: 13,
    marginLeft: 10,
    color: '#000',
  },
  playerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#b5b5b5',
    shadowColor: '#b5b5b5',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 11.55,
    elevation: 2,
    padding: 10,
    marginHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imageStyle: {
    flex: 1,
    height: 900,
    width: '100%',
    resizeMode: 'contain',
    marginTop: 0,
    padding: 0,
    marginBottom: 54,
  },
  textItem: {
    fontSize: 18,
    alignItems: 'center',
    fontWeight: 'bold',
    elevation: 2,
    marginTop: 10,
    color: '#ccc',
  },
  containerplus: {
    position: 'absolute',
    bottom: -20,
    right: 30,
  },
  circleButton: {
    width: 60, // Adjust size of the button
    height: 60, // Adjust size of the button
    borderRadius: 30, // Half of the width and height to make it circular
    backgroundColor: '#007AFF', // Background color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
});
