/* eslint-disable prettier/prettier */
import axios from 'axios';
import {REACT_APP_BASE_URL} from '@env';

const baseUrl = REACT_APP_BASE_URL;

export const getProducts = (params, controller) => {
  const url = `${baseUrl}/products?limit=${params.limit}&page=${params.page}&category=${params.category}&search=${params.search}&order=${params.sort}`;
  console.log(url);
  return axios.get(url, {signal: controller.signal});
};

export const getProductsDetails = (params, controller) => {
  const url = `${baseUrl}/products/${params}`;
  return axios.get(url, params, {signal: controller.signal});
};

export const createProduct = (token, file, body, controller) => {
  const url = baseUrl + '/products';
  const formData = new FormData();
  if (file !== '') {
    formData.append('image', {
      uri: file.uri,
      name: file.fileName,
      type: file.type,
    });
  }
  Object.entries(body).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return axios.post(url, formData, {
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = (token, id, file, body, controller) => {
  const url = `${baseUrl}/products/${id}`;
  const formData = new FormData();
  if (file !== '') {
    formData.append('image', {
      uri: file.uri,
      name: file.fileName,
      type: file.type,
    });
  }
  Object.entries(body).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return axios.patch(url, formData, {
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deletingProduct = (token, id, controller) => {
  const url = `${baseUrl}/products/${id}`;
  return axios.delete(url, {
    signal: controller.signal,
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const getPromos = controller => {
  const url = baseUrl + '/promos';
  return axios.get(url, {signal: controller.signal});
};

export const addPromos = (token, body, controller) => {
  const url = baseUrl + '/promos';
  return axios.post(url, body, {
    signal: controller.signal,
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const editingPromo = (token, id, body, controller) => {
  const url = baseUrl + '/promos/' + id;
  return axios.patch(url, body, {
    signal: controller.signal,
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const deletingPromo = (token, id, controller) => {
  const url = baseUrl + '/promos/delete/' + id;
  return axios.delete(url, {
    signal: controller.signal,
    headers: {Authorization: `Bearer ${token}`},
  });
};
