import React from 'react';
import {
  List,
  Filter,
  Datagrid,
  TextField,
  ReferenceField,
  ImageField,
  DateField,
  Show,
  SimpleShowLayout,
  Create,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  DateTimeInput,
  EditButton,
} from 'react-admin';

import { AlbumReferenceField, AlbumReferenceInput } from './albums';

/** Photo reference field */
export const PhotoReferenceField = props => (
  <ReferenceField reference="photos" {...props}>
    <TextField source="title" />
  </ReferenceField>
);
PhotoReferenceField.defaultProps = {
  addLabel: true,
};

/** Photo reference input. */
export const PhotoReferenceInput = props => (
  <ReferenceInput reference="photos" {...props}>
    <AutocompleteInput optionText="title" />
  </ReferenceInput>
);

/** Photo list filters */
const PhotoFilters = props => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <AlbumReferenceInput source="album_id" />
  </Filter>
);

/** Photo list view */
export const PhotoList = props => (
  <List filters={<PhotoFilters />} {...props}>
    <Datagrid>
      <TextField source="id" />
      <AlbumReferenceField source="album_id" />
      <TextField source="title" />
      <ImageField source="url" />
      <DateField source="date" showTime={true} />
      <TextField source="description" />
      <EditButton />
    </Datagrid>
  </List>
);

/** Photo show view */
export const PhotoShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <AlbumReferenceField source="album_id" />
      <TextField source="title" />
      <ImageField source="url" />
      <DateField source="date" showTime={true} />
      <TextField source="description" />
    </SimpleShowLayout>
  </Show>
);

/** Photo create view */
export const PhotoCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <AlbumReferenceInput source="album_id" />
      <TextInput source="title" />
      <TextInput source="url" />
      <DateTimeInput source="date" />
      <TextInput source="description" />
    </SimpleForm>
  </Create>
);

/** Photo edit view */
export const PhotoEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <AlbumReferenceInput source="album_id" />
      <TextInput source="title" />
      <TextInput source="url" />
      <DateTimeInput source="date" />
      <TextInput source="description" />
    </SimpleForm>
  </Edit>
);
