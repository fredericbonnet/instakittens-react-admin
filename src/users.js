import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  ImageField,
  Show,
  SimpleShowLayout,
  Create,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  EditButton,
} from 'react-admin';

export const UserList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="firstName" />
      <TextField source="lastName" />
      <EmailField source="email" />
      <ImageField source="avatar" />
      <EditButton />
    </Datagrid>
  </List>
);

export const UserShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="firstName" />
      <TextField source="lastName" />
      <EmailField source="email" />
      <ImageField source="avatar" />
    </SimpleShowLayout>
  </Show>
);

export const UserCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="firstName" />
      <TextInput source="lastName" />
      <TextInput source="email" />
      <TextInput source="avatar" />
    </SimpleForm>
  </Create>
);

export const UserEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="username" />
      <TextInput source="firstName" />
      <TextInput source="lastName" />
      <TextInput source="email" />
      <TextInput source="avatar" />
    </SimpleForm>
  </Edit>
);
