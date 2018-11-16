import React from 'react';
import {
  List,
  Filter,
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
  AutocompleteInput,
  EditButton,
} from 'react-admin';

import { UserReferenceField, UserReferenceInput } from './users';

/** Album reference field */
export const AlbumReferenceField = props => (
  <ReferenceField reference="albums" {...props}>
    <TextField source="title" />
  </ReferenceField>
);
AlbumReferenceField.defaultProps = {
  addLabel: true,
};

/** Album reference input. */
export const AlbumReferenceInput = props => (
  <ReferenceInput reference="albums" {...props}>
    <AutocompleteInput optionText="title" />
  </ReferenceInput>
);

/** Album list filters */
const AlbumFilters = props => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <UserReferenceInput source="user_id" allowEmpty />
  </Filter>
);

/** Album list view */
export const AlbumList = props => (
  <List filters={<AlbumFilters />} {...props}>
    <Datagrid>
      <TextField source="id" />
      <UserReferenceField source="user_id" />
      <TextField source="title" />
      <TextField source="type" />
      <TextField source="description" />
      <EditButton />
    </Datagrid>
  </List>
);

/** Album show view */
export const AlbumShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <UserReferenceField source="user_id" />
      <TextField source="title" />
      <TextField source="type" />
      <TextField source="description" />
    </SimpleShowLayout>
  </Show>
);

/** Album create view */
export const AlbumCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <UserReferenceInput source="user_id" />
      <TextInput source="title" />
      <TextInput source="type" />
      <TextInput source="description" />
    </SimpleForm>
  </Create>
);

/** Album edit view */
export const AlbumEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <UserReferenceInput source="user_id" />
      <TextInput source="title" />
      <TextInput source="type" />
      <TextInput source="description" />
    </SimpleForm>
  </Edit>
);
