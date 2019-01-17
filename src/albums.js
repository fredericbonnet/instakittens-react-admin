import React from 'react';
import {
  List,
  Filter,
  Datagrid,
  TextField,
  ReferenceField,
  ReferenceManyField,
  Pagination,
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
  ShowButton,
  EditButton,
} from 'react-admin';
import CreateRelatedButton from './CreateRelatedButton';

import { UserReferenceField, UserReferenceInput } from './users';
import { PhotoReferenceManyField } from './photos';

/** Album icon */
import AlbumIcon from '@material-ui/icons/PhotoAlbum';
export { AlbumIcon };

/** Album reference field */
export const AlbumReferenceField = props => (
  <ReferenceField reference="albums" allowEmpty {...props}>
    <TextField source="title" />
  </ReferenceField>
);
AlbumReferenceField.defaultProps = {
  addLabel: true,
};

/** Album reference input. */
export const AlbumReferenceInput = props => (
  <ReferenceInput reference="albums" allowEmpty {...props}>
    <AutocompleteInput optionText="title" />
  </ReferenceInput>
);

/** Album reference list */
export const AlbumReferenceManyField = props => (
  <ReferenceManyField
    pagination={<Pagination />}
    perPage={10}
    reference="albums"
    {...props}
  >
    <Datagrid>
      <TextField source="id" />
      {props.target !== 'user_id' && <UserReferenceField source="user_id" />}
      <TextField source="title" />
      <TextField source="type" />
      <TextField source="description" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </ReferenceManyField>
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
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

/** Album show view */
export const AlbumShow = props => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Summary">
        <TextField source="id" />
        <UserReferenceField source="user_id" />
        <TextField source="title" />
        <TextField source="type" />
        <TextField source="description" />
      </Tab>
      <Tab label="Photos" path="photos">
        <CreateRelatedButton target="album_id" related="photos" />
        <PhotoReferenceManyField target="album_id" addLabel={false} />
      </Tab>
    </TabbedShowLayout>
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
    <TabbedForm>
      <FormTab label="Summary">
        <DisabledInput source="id" />
        <UserReferenceInput source="user_id" />
        <TextInput source="title" />
        <TextInput source="type" />
        <TextInput source="description" />
      </FormTab>
      <FormTab label="Photos" path="photos">
        <CreateRelatedButton target="album_id" related="photos" />
        <PhotoReferenceManyField target="album_id" addLabel={false} />
      </FormTab>
    </TabbedForm>
  </Edit>
);
