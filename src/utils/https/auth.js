/* eslint-disable prettier/prettier */
import axios from 'axios';
import {REACT_APP_BASE_URL} from '@env';
import store from '../../redux/store';

const baseUrl = REACT_APP_BASE_URL;

export const fetchLogin = (body, controller) => {
  const url = `${baseUrl}/auth`;
  console.log(url)
  return axios.post(url, body, {signal: controller.signal});
};

export const register = (email, password, phone_number, controller) => {
  const url = `${baseUrl}/auth/register`;
  const body = {email, password, phone_number};
  return axios.post(url, body, {signal: controller.signal});
};

export const forgotEmail = (email, controller) => {
  const url = `${baseUrl}/auth/forgot`;
  const body = {email};
  console.log(body)
  return axios.patch(url, body, {signal: controller.signal});
};

export const setPassbyForgot = (email, otpCode, password, controller) => {
  const url = `${baseUrl}/auth/editpassbyforgot`;
  const body = {email, otp_code: otpCode, password};
  return axios.patch(url, body, {signal: controller.signal});
};

export const getProfile = (token, controller) => {
  const url = `${baseUrl}/users`;
  console.log(url)
  // const storeToken = store.getState();
  // const token = storeToken.user.token;
  console.log(token)
  return axios.get(url, {signal: controller.signal, headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },});
};

export const updateProfile = (token, file, body, controller) => {
  const url = `${baseUrl}/auth/profile`;
  console.log('FILE IMAGE', file);
  const formData = new FormData();
  if (file !== '') {
    formData.append('profile_image', {
      uri: file.uri,
      name: file.fileName,
      type: file.type,
    });
  }
  Object.entries(body).forEach(([key, value]) => {
    formData.append(key, value);
  });
  // Object.keys(body).forEach(key => {
  //   formData.set(key, body[key]);
  // });
  console.log('BODY', body)
  console.log('FORMDATA', formData);
  return axios.patch(url, formData,{
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const editPasswordNoOtp = (token, body, controller) => {
  const url = `${baseUrl}/auth`;
  return axios.patch(url, body, {
    signal: controller.signal,
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const authLogout = (token, controller) => {
  const url = `${baseUrl}/auth/logout`;
  return axios.delete(url, {
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const loginFirebase = (body, controller) => {
  const url = `${baseUrl}/auth/login-firebase`;
  return axios.patch(url, body, {signal: controller.signal});
};
