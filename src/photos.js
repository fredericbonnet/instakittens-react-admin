import React from 'react';
import {
  List,
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

export const PhotoList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="album_id" reference="albums">
        <TextField source="title" />
      </ReferenceField>
      <TextField source="title" />
      <ImageField source="url" />
      <DateField source="date" showTime={true} />
      <TextField source="description" />
      <EditButton />
    </Datagrid>
  </List>
);

export const PhotoShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="album_id" reference="albums">
        <TextField source="title" />
      </ReferenceField>
      <TextField source="title" />
      <ImageField source="url" />
      <DateField source="date" showTime={true} />
      <TextField source="description" />
    </SimpleShowLayout>
  </Show>
);

export const PhotoCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="album_id" reference="albums">
        <AutocompleteInput optionText="title" />
      </ReferenceInput>
      <TextInput source="title" />
      <TextInput source="url" />
      <DateTimeInput source="date" />
      <TextInput source="description" />
    </SimpleForm>
  </Create>
);

export const PhotoEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <ReferenceInput source="album_id" reference="albums">
        <AutocompleteInput optionText="title" />
      </ReferenceInput>
      <TextInput source="title" />
      <TextInput source="url" />
      <DateTimeInput source="date" />
      <TextInput source="description" />
    </SimpleForm>
  </Edit>
);
