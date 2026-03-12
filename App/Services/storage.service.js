
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../api/api.service';

export const setItem = async (itemKey, value) => {
  try {
    if (value) {
      await AsyncStorage.setItem(itemKey, JSON.stringify(value));
    }
  } catch (e) {
    console.error(e);
  }
};

export const mergeItem = async (itemKey, value) => {
  try {
    if (value) {
      await AsyncStorage.mergeItem(itemKey, JSON.stringify(value));
    }
  } catch (e) {
    console.error(e);
  }
};

export const getItem = async itemKey => {
  try {
    const value = await AsyncStorage.getItem(itemKey);
    if (value) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.error(e);
  }
};

export const setItems = async values => {
  try {
    await AsyncStorage.multiSet(values);
    return true;
  } catch (e) {
    console.error(e);
  }
};

export const getItems = async values => {
  try {
    return await AsyncStorage.multiGet(values);
  } catch (e) {
    console.error(e);
  }
};

export const removeAllItems = values => {
  try {
    return AsyncStorage.clear();
  } catch (e) {
    console.error(e);
  }
};
