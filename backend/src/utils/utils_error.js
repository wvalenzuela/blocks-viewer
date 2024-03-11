export const FormatReplyErrors = (e, models, name_variable) => {
  if (e && typeof e === 'string' && e.constructor === String) {
    return [{ path: 'unknown', message: e }];
  }
  if (models && e instanceof models.Sequelize.ValidationError) {
    const t = e.errors.map((item) => _.pick(item, ['path', 'message']));
    return t;
  }
  if (e instanceof TypeError || e instanceof Error) {
    const { message, name } = e;
    console.log('e instanceof TypeError || e instanceof Error', {
      message,
      name,
    });
    if (message && name) {
      return [{ path: name, message }];
    } else if (message) {
      return [{ path: 'Error', message }];
    } else {
      return [{ path: 'Error', message: 'Unknown error type' }];
    }
  }
  if (e.errors !== undefined) {
    console.log('e.errors !== undefined', { e });
    return e.errors.map((item) => {
      const { path, name, message } = item;
      let final = {
        path: 'Error',
        message: 'Unknown error in Format',
      };
      if (path) final.path = path;
      else if (name) final.path = name;
      if (message) final.message = message;
      return final;
    });
  }
  if (e.constructor === Array) {
    if (!e.length) return null;
    const errors = e.map((x) => {
      const { path, message, name } = x;
      let final = {
        path: 'Error',
        message: 'Unknown error in Format',
      };
      if (message) final.message = message;
      if (x && typeof x === 'string' && x.constructor === String) {
        final.message = x;
      }
      if (path) final.path = path;
      if (name) final.path = name;
      return final;
    });
    console.log('e.constructor === Array', { e });
    return errors.map((x) => {
      let { message } = x;
      if (message === undefined || !message) {
        message = 'Unknown error in Format';
      }
      return {
        path: 'Error',
        message,
      };
    });
  }
  if (name_variable) {
    return [
      {
        path: name_variable,
        message: `FormatReplyErrors: Something went wrong ${JSON.stringify(e)}`,
      },
    ];
  }
  return [
    {
      path: 'name',
      message: `FormatReplyErrors: Something went wrong ${JSON.stringify(e)}`,
    },
  ];
};
