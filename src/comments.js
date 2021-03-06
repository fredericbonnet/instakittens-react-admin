import React from 'react';
import {
  List,
  Filter,
  Datagrid,
  TextField,
  DateField,
  ReferenceManyField,
  Pagination,
  Show,
  SimpleShowLayout,
  Create,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  DateTimeInput,
  ShowButton,
  EditButton,
} from 'react-admin';

import { UserReferenceField, UserReferenceInput } from './users';
import { PhotoReferenceField, PhotoReferenceInput } from './photos';

/** Comment icon */
import CommentIcon from '@material-ui/icons/Comment';
export { CommentIcon };

/** Comment reference list */
export const CommentReferenceManyField = props => (
  <ReferenceManyField
    pagination={<Pagination />}
    perPage={10}
    reference="comments"
    {...props}
  >
    <Datagrid data-testid="comment-reference-list">
      <TextField source="id" />
      {props.target !== 'photo_id' && <PhotoReferenceField source="photo_id" />}
      {props.target !== 'user_id' && <UserReferenceField source="user_id" />}
      <DateField source="date" showTime={true} />
      <TextField source="message" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </ReferenceManyField>
);

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
      <DateField source="date" showTime={true} />
      <TextField source="message" />
      <ShowButton />
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
      <DateField source="date" showTime={true} />
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
