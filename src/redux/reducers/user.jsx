import { message } from 'antd';
import { setToken, getToken, removeToken } from '../../utils/auth';
import {
  LOGOUT, LOGIN_FAILURE, LOGIN_SUCCESS,
  LOGIN_REQUEST,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, TOGGLE_ORDER_DETAIL,
  SHOWMODAL, HIDEMODAL, SWITCHISMOTION,
  UPDATESTATE, QUERYSUCCESS, QUERY,
  DELETE, MULTIDELETE, CREATE, UPDATE,
} from '../types/user.js';
import { prefix, userKey, } from '../../config';


const userReducer = (state = {
  list: [],
  pagination: {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `Total ${total} Items`,
    current: 1,
    total: 0,
  },
  currentItem: {},
  modalVisible: false,
  modalType: 'create',
  selectedRowKeys: [],
  isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',


  authenticated: false,
  isAuthenticating: false,
  customData: '',
  token: getToken(),
  statusText: '',
  isAdmin: false,
  user: localStorage.getItem(userKey) && JSON.parse(localStorage.getItem(userKey)),
  showOrderDetail: true
}, action) => {
  switch (action.type) {
    case LOGOUT:
      removeToken();
      window.localStorage.removeItem(userKey);
      return {
        ...state,
        token: '',
        user: null,
      };
    case LOGIN_SUCCESS:
      message.success('登录成功');
      // 设置菜单, token信息
      const { token, user } = action.payload;
      console.log('登录成功--', action.payload);
      // 设置cookie
      setToken(token, {
        path: '/',
        expires: 10,
      });
      window.localStorage.setItem(userKey, JSON.stringify(user));
      return {
        ...state,
        token,
        user,
      };
    case LOGIN_FAILURE:
      message.error(action.payload.msg || '登录失败，请稍后重试');
      return {
        ...state,
        token: '',
        msg: action.payload.msg,
      };
    case UPDATESTATE:
      return {
        ...state,
        ...action.payload,
      };
    case QUERYSUCCESS:
      return {
        ...state,
        list: action.payload.list,
        pagination: {
          ...state.pagination,
          ...action.payload.pagination,
        },
      };
    case QUERY:
      const { list, pagination } = action.payload;
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      };
    case DELETE:
      return { ...state, selectedRowKeys: action.selectedRowKeys.filter(_ => _ !== action.payload) };
    case MULTIDELETE:
      return { ...state, selectedRowKeys: [] };
    case CREATE:
      return { ...state, ...action.payload, modalVisible: false };
    case UPDATE:
      return { ...state, modalVisible: false };
    case SHOWMODAL:
      return { ...state, ...action.payload, modalVisible: true };
    case HIDEMODAL:
      return { ...state, modalVisible: false };
    case SWITCHISMOTION:
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion);
      return { ...state, isMotion: !state.isMotion };

    case LOGIN_REQUEST:
      return {
        ...state,
        isAuthenticating: true
      };
    case LOGOUT_REQUEST:
      return state;
    case LOGOUT_SUCCESS:
      return {
        ...state,
        authenticated: false,
        isAuthenticating: false,
        token: null,
        statusText: '',
        isAdmin: false,
        user: ''
      };
    case TOGGLE_ORDER_DETAIL:
      return {
        ...state,
        showOrderDetail: !state.showOrderDetail
      };
    default:
      return state;
  }
};
export default userReducer;
