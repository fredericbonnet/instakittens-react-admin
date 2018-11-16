import React from 'react';
import { Admin, Resource } from 'react-admin';

import { UserList, UserCreate, UserShow, UserEdit } from './users';
import { AlbumList, AlbumCreate, AlbumShow, AlbumEdit } from './albums';
import { PhotoList, PhotoCreate, PhotoShow, PhotoEdit } from './photos';
import {
  CommentList,
  CommentCreate,
  CommentShow,
  CommentEdit,
} from './comments';

import jsonServerProvider from 'ra-data-json-server';

import './App.css';

const dataProvider = jsonServerProvider('http://localhost:3000'); // FIXME hardcoded URL

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="users"
      list={UserList}
      show={UserShow}
      create={UserCreate}
      edit={UserEdit}
    />
    <Resource
      name="albums"
      list={AlbumList}
      show={AlbumShow}
      create={AlbumCreate}
      edit={AlbumEdit}
    />
    <Resource
      name="photos"
      list={PhotoList}
      show={PhotoShow}
      create={PhotoCreate}
      edit={PhotoEdit}
    />
    <Resource
      name="comments"
      list={CommentList}
      show={CommentShow}
      create={CommentCreate}
      edit={CommentEdit}
    />
  </Admin>
);

export default App;
