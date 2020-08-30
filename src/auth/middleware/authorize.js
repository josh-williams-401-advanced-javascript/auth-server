'use strict';

module.exports = (capability) => {

  return (req, res, next) => {
    
    try {
      if (req.user.capabilities.includes(capability)) {
        next();
      } else {
        next('Access denied');
      }
    } catch (e) {
      next('Capabilities undetermined, authorization failed');
    }
  };
};
