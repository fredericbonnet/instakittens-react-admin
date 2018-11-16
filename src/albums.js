import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  Create,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  ReferenceInput,
  SelectInput,
  EditButton,
} from 'react-admin';

export const AlbumList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="user_id" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <TextField source="title" />
      <TextField source="type" />
      <TextField source="description" />
      <EditButton />
    </Datagrid>
  </List>
);

export const AlbumShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="user_id" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <TextField source="title" />
      <TextField source="type" />
      <TextField source="description" />
    </SimpleShowLayout>
  </Show>
);

export const AlbumCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="user_id" reference="users">
        <SelectInput optionText="username" />
      </ReferenceInput>
      <TextInput source="title" />
      <TextInput source="type" />
      <TextInput source="description" />
    </SimpleForm>
  </Create>
);

export const AlbumEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <ReferenceInput source="user_id" reference="users">
        <SelectInput optionText="username" />
      </ReferenceInput>
      <TextInput source="title" />
      <TextInput source="type" />
      <TextInput source="description" />
    </SimpleForm>
  </Edit>
);
