import React from 'react';
import { Admin, Resource } from 'react-admin';

import { UserIcon, UserList, UserCreate, UserShow, UserEdit } from './users';
import {
  AlbumIcon,
  AlbumList,
  AlbumCreate,
  AlbumShow,
  AlbumEdit,
} from './albums';
import {
  PhotoIcon,
  PhotoList,
  PhotoCreate,
  PhotoShow,
  PhotoEdit,
} from './photos';
import {
  CommentIcon,
  CommentList,
  CommentCreate,
  CommentShow,
  CommentEdit,
} from './comments';
import LoginPage from './LoginPage';

import jsonServerProvider from 'ra-data-json-server';
import { authProvider, httpClient } from './auth-basic';

import './App.css';

const dataProvider = jsonServerProvider(
  process.env.REACT_APP_API_URL,
  httpClient
);

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={LoginPage}
  >
    <Resource
      name="users"
      icon={UserIcon}
      list={UserList}
      show={UserShow}
      create={UserCreate}
      edit={UserEdit}
    />
    <Resource
      name="albums"
      icon={AlbumIcon}
      list={AlbumList}
      show={AlbumShow}
      create={AlbumCreate}
      edit={AlbumEdit}
    />
    <Resource
      name="photos"
      icon={PhotoIcon}
      list={PhotoList}
      show={PhotoShow}
      create={PhotoCreate}
      edit={PhotoEdit}
    />
    <Resource
      name="comments"
      icon={CommentIcon}
      list={CommentList}
      show={CommentShow}
      create={CommentCreate}
      edit={CommentEdit}
    />
  </Admin>
);

export default App;
