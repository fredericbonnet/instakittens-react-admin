import React from 'react';
import { CreateButton } from 'react-admin';

/** Create button for related resources */
const CreateRelatedButton = ({
  className,
  record,
  related,
  source,
  target,
  ...rest
}) => (
  <CreateButton
    className="CreateRelatedButton"
    to={{
      pathname: `/${related}/create`,
      state: {
        record: ((key, value) => {
          const o = {};
          o[key] = value;
          return o;
        })(target, record.id),
      },
    }}
    {...rest}
  />
);

export default CreateRelatedButton;
