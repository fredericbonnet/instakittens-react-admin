import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  Show,
  SimpleShowLayout,
  Create,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
  EditButton,
} from 'react-admin';

export const CommentList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="photo_id" reference="photos">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="user_id" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <DateField source="date" showTime={true} />
      <TextField source="message" />
      <EditButton />
    </Datagrid>
  </List>
);

export const CommentShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="photo_id" reference="photos">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="user_id" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <DateField source="date" showTime={true} />
      <TextField source="message" />
    </SimpleShowLayout>
  </Show>
);

export const CommentCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="photo_id" reference="photos">
        <SelectInput optionText="title" />
      </ReferenceInput>
      <ReferenceInput source="user_id" reference="users">
        <SelectInput optionText="username" />
      </ReferenceInput>
      <DateTimeInput source="date" />
      <TextInput source="message" />
    </SimpleForm>
  </Create>
);

export const CommentEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <ReferenceInput source="photo_id" reference="photos">
        <SelectInput optionText="title" />
      </ReferenceInput>
      <ReferenceInput source="user_id" reference="users">
        <SelectInput optionText="username" />
      </ReferenceInput>
      <DateTimeInput source="date" />
      <TextInput source="message" />
    </SimpleForm>
  </Edit>
);
