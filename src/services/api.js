import axios from 'axios';

// Configuration centrale
const BASE_URL = 'http://109.199.113.94:30079';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Client API par défaut
const api = axios.create({
  baseURL: BASE_URL,
});

export default api;

// Configuration des services
const SERVICES = {
  account: 'service-account',
  banksAccount: 'service-banks-account',
  banks: 'service-banks',
  card: 'service-card',
  rechargeRetrait: 'service-recharge-retrait',
  transactions: 'service-transactions',
  transfert: 'service-transfert',
  user: 'service-users',
};

// Fonction utilitaire pour créer les URLs
const createServiceUrl = (serviceName) => `${BASE_URL}/${serviceName}/graphql`;

// Fonction utilitaire pour créer les clients API
const createApiClient = (serviceUrl) => axios.create({
  baseURL: serviceUrl,
  headers: DEFAULT_HEADERS,
});

// URLs des services
export const urlUser = createServiceUrl(SERVICES.user);
export const urlAccount = createServiceUrl(SERVICES.account);
export const urlTransaction = createServiceUrl(SERVICES.transactions);
export const urlCard = createServiceUrl(SERVICES.card);
export const urlRechargeRetrait = createServiceUrl(SERVICES.rechargeRetrait);
export const urlTransfert = createServiceUrl(SERVICES.transfert);
export const urlBanksAccount = createServiceUrl(SERVICES.banksAccount);
export const urlBanks = createServiceUrl(SERVICES.banks);

// Clients Axios spécifiques
export const userApi = createApiClient(urlUser);
export const accountApi = createApiClient(urlAccount);
export const transactionApi = createApiClient(urlTransaction);
export const cardApi = createApiClient(urlCard);
export const rechargeRetraitApi = createApiClient(urlRechargeRetrait);
export const transfertApi = createApiClient(urlTransfert);
export const banksAccountApi = createApiClient(urlBanksAccount);
export const banksApi = createApiClient(urlBanks);
export const bankApi = createApiClient(urlBanks);