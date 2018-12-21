import React from 'react';
import {
  List,
  Filter,
  Datagrid,
  TextField,
  ReferenceField,
  EmailField,
  ImageField,
  Show,
  TabbedShowLayout,
  Tab,
  Create,
  Edit,
  SimpleForm,
  TabbedForm,
  FormTab,
  DisabledInput,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  EditButton,
} from 'react-admin';

import { AlbumReferenceManyField } from './albums';
import { CommentReferenceManyField } from './comments';

/** User icon */
import UserIcon from '@material-ui/icons/Person';
export { UserIcon };

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

/** User list filters */
const UserFilters = props => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
  </Filter>
);

/** User list view */
export const UserList = props => (
  <List filters={<UserFilters />} {...props}>
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
    <TabbedShowLayout>
      <Tab label="Summary">
        <TextField source="id" />
        <TextField source="username" />
        <TextField source="firstName" />
        <TextField source="lastName" />
        <EmailField source="email" />
        <ImageField source="avatar" />
      </Tab>
      <Tab label="Albums" path="albums">
        <AlbumReferenceManyField target="user_id" addLabel={false} />
      </Tab>
      <Tab label="Comments" path="comments">
        <CommentReferenceManyField target="user_id" addLabel={false} />
      </Tab>
    </TabbedShowLayout>
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
    <TabbedForm>
      <FormTab label="Summary">
        <DisabledInput source="id" />
        <TextInput source="username" />
        <TextInput source="firstName" />
        <TextInput source="lastName" />
        <TextInput source="email" />
        <TextInput source="avatar" />
      </FormTab>
      <FormTab label="Albums" path="albums">
        <AlbumReferenceManyField target="user_id" addLabel={false} />
      </FormTab>
      <FormTab label="Comments" path="comments">
        <CommentReferenceManyField target="user_id" addLabel={false} />
      </FormTab>
    </TabbedForm>
  </Edit>
);
