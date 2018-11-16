import React from 'react';
import {
  Admin,
  Resource,
  ListGuesser,
  ShowGuesser,
  EditGuesser,
} from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import './App.css';

const dataProvider = jsonServerProvider('http://localhost:3000'); // FIXME hardcoded URL

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="users"
      list={ListGuesser}
      show={ShowGuesser}
      edit={EditGuesser}
    />
    <Resource
      name="albums"
      list={ListGuesser}
      show={ShowGuesser}
      edit={EditGuesser}
    />
    <Resource
      name="photos"
      list={ListGuesser}
      show={ShowGuesser}
      edit={EditGuesser}
    />
    <Resource
      name="comments"
      list={ListGuesser}
      show={ShowGuesser}
      edit={EditGuesser}
    />
  </Admin>
);

export default App;
