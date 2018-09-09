'use strict';

module.exports = (obj, fields) => {
  if(!fields) {
    return obj;
  }

  if(typeof fields === 'string') {
    fields = fields.split(' ');
  }

  const data = { ...obj.toObject() };

  for(const prop of Object.keys(data)) {
    if(!fields.includes(prop)) {
      delete data[prop]; // eslint-disable-line
    }
  }

  return data;
};
