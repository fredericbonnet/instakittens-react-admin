import React from 'react';
import {
  List,
  Filter,
  Datagrid,
  TextField,
  DateField,
  Show,
  SimpleShowLayout,
  Create,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  DateTimeInput,
  EditButton,
} from 'react-admin';

import { UserReferenceField, UserReferenceInput } from './users';
import { PhotoReferenceField, PhotoReferenceInput } from './photos';

/** Comment list filters */
const CommentFilters = props => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <PhotoReferenceInput source="photo_id" />
    <UserReferenceInput source="user_id" />
  </Filter>
);

/** Comment list view */
export const CommentList = props => (
  <List filters={<CommentFilters />} {...props}>
    <Datagrid>
      <TextField source="id" />
      <PhotoReferenceField source="photo_id" />
      <UserReferenceField source="user_id" />
      <DateField source="date" showTime="true" />
      <TextField source="message" />
      <EditButton />
    </Datagrid>
  </List>
);

/** Comment show view */
export const CommentShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <PhotoReferenceField source="photo_id" />
      <UserReferenceField source="user_id" />
      <DateField source="date" showTime="true" />
      <TextField source="message" />
    </SimpleShowLayout>
  </Show>
);

/** Comment create view */
export const CommentCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <PhotoReferenceInput source="photo_id" />
      <UserReferenceInput source="user_id" />
      <DateTimeInput source="date" />
      <TextInput source="message" />
    </SimpleForm>
  </Create>
);

/** Comment edit view */
export const CommentEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <PhotoReferenceInput source="photo_id" />
      <UserReferenceInput source="user_id" />
      <DateTimeInput source="date" />
      <TextInput source="message" />
    </SimpleForm>
  </Edit>
);
