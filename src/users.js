import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EmailField,
  ImageField,
  Show,
  SimpleShowLayout,
  Create,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  EditButton,
} from 'react-admin';

/** User reference field */
export const UserReferenceField = props => (
  <ReferenceField reference="users" {...props}>
    <TextField source="username" />
  </ReferenceField>
);
UserReferenceField.defaultProps = {
  addLabel: true,
};

/** User reference input. */
export const UserReferenceInput = props => (
  <ReferenceInput reference="users" {...props}>
    <AutocompleteInput optionText="username" />
  </ReferenceInput>
);

/** User list view */
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

/** User show view */
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

/** User create view */
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

/** User edit view */
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
