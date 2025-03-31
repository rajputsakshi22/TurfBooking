/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DatePicker = ({date, onDateChange}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const formattedDate = date.toLocaleDateString('en-GB'); // Format as day/month/year
    setSelectedDate(formattedDate);
    onDateChange(formattedDate);
    hideDatePicker();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          showDatePicker();
        }}>
        <Text
          style={{
            // marginLeft: -40,
            marginLeft: 3,
            fontFamily: 'Roboto-Bold',
            // fontSize: 12,
            fontSize: 14,
            // color: '#010048',
            color: selectedDate ? 'black' : '#899499',
          }}>
          {selectedDate || 'Enter Date of Birth'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default DatePicker;
