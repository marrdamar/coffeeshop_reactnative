/* eslint-disable prettier/prettier */
import axios from 'axios';
import {REACT_APP_BASE_URL} from '@env';

const baseUrl = REACT_APP_BASE_URL;

export const addTransactions = (token, data, controller) => {
  const url = `${baseUrl}/transactions`;
  return axios.post(url, data, {
    signal: controller.signal,
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const getHistory = (token, controller) => {
  const url = `${baseUrl}/transactions`;
  return axios.get(url, {
    signal: controller.signal,
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const deleteTransaction = (token, id, controller) => {
  const url = `${baseUrl}/transactions/${id}`;
  return axios.delete(url, {
    signal: controller.signal,
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const getAllOrder = (token, controller) => {
  const url = `${baseUrl}/transactions/allhist`;
  return axios.get(url, {
    signal: controller.signal,
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const getDoneOrder = (token, controller) => {
  const url = `${baseUrl}/transactions/getallpaid`;
  return axios.get(url, {
    signal: controller.signal,
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const changeOrderDone = (token, id, controller) => {
  const url = `${baseUrl}/transactions/paid/${id}`;
  return axios.patch(url, id, {
    signal: controller.signal,
    headers: {Authorization: `Bearer ${token}`},
  });
};
