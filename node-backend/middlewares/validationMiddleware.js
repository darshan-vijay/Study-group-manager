const { body, validationResult } = require('express-validator');

exports.validateSignUp = [
  body('username')
    .notEmpty().withMessage('Username is required.')
    .isAlphanumeric().withMessage('Username must contain only letters and numbers.')
    .isLength({ min: 3, max: 15 }).withMessage('Username must be between 3 and 15 characters.'),
  body('email').notEmpty().withMessage('Email is required.').isEmail().withMessage('Invalid email format.'),
  body('password').notEmpty().withMessage('Password is required.')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 characters long.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
    .matches(/\d/).withMessage('Password must contain at least one digit.')
    .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character.'),
  body('firstName').notEmpty().withMessage('First name is required.'),
  body('lastName').notEmpty().withMessage('Last name is required.'),
  body('courseOfStudy').notEmpty().withMessage('Course of study is required.'),
  body('yearOfStudy').notEmpty().withMessage('Year of study is required.')
    .isInt({ min: 1, max: 4 }).withMessage('Year of study must be between 1 and 4.'),
  body('typeOfDegree').notEmpty().withMessage('Type of degree is required.'),
  body('gender').notEmpty().withMessage('Gender is required.')
    .isIn(['male', 'female', 'other']).withMessage('Gender must be "male", "female", or "other".'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


// Middleware to validate the request body for logging in
exports.validateLogIn = [
    body('email').notEmpty().withMessage('Email is required.').isEmail().withMessage('Invalid email format.'),
    body('password').notEmpty().withMessage('Password is required.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
  

// Middleware to validate the request body for creating a new group
exports.validateCreateGroup = [
  body('groupName')
    .notEmpty().withMessage('Group name is required.')
    .isString().withMessage('Group name must be a string.')
    .isLength({ max: 50 }).withMessage('Group name must not exceed 50 characters.'),

  body('subject')
    .notEmpty().withMessage('Subject is required.')
    .isString().withMessage('Subject must be a string.'),

  body('date')
    .notEmpty().withMessage('Date is required.')
    .isISO8601().withMessage('Date must be in ISO 8601 format.'),

  body('time')
    .notEmpty().withMessage('Time is required.')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:mm format.'),

  body('type')
    .notEmpty().withMessage('Type is required.')
    .isIn(['online', 'offline']).withMessage('Type must be "online" or "offline".'),

  body('location')
    .if(body('type').equals('offline'))
    .notEmpty().withMessage('Location is required for offline groups.')
    .isString().withMessage('Location must be a string.'),

  body('building')
    .if(body('type').equals('offline'))
    .notEmpty().withMessage('Building is required for offline groups.')
    .isString().withMessage('Building must be a string.'),

  body('friends')
    .optional()
    .isArray().withMessage('Friends must be an array of client IDs.')
    .custom(async (friends) => {
      // Validate each friend ID in the array
      const validFriends = await Promise.all(friends.map(async (friendId) => {
        const friend = await clientModel.getClientById(friendId);
        return friend !== null;
      }));

      if (validFriends.includes(false)) {
        throw new Error('Some of the provided friends are not valid.');
      }
      return true;
    }),

    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // For online groups, generate a Zoom link if not provided
    if (req.body.type === 'online' && !req.body.zoomLink) {
      req.body.zoomLink = `https://zoom.us/${Math.random().toString(36).substring(7)}`;
    }

    next();
  },
];

// Add validation to check friends list
exports.validateCreateGroup = [
  body('groupName')
    .notEmpty().withMessage('Group name is required.')
    .isString().withMessage('Group name must be a string.')
    .isLength({ max: 50 }).withMessage('Group name must not exceed 50 characters.'),
  
  body('subject')
    .notEmpty().withMessage('Subject is required.')
    .isString().withMessage('Subject must be a string.'),
  
  body('date')
    .notEmpty().withMessage('Date is required.')
    .isISO8601().withMessage('Date must be in ISO 8601 format.'),
  
  body('time')
    .notEmpty().withMessage('Time is required.')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:mm format.'),
  
  body('location')
    .if(body('subject').equals('offline'))
    .notEmpty().withMessage('Location is required for offline groups.')
    .isString().withMessage('Location must be a string.'),

  body('friends')
    .optional()
    .isArray().withMessage('Friends must be an array of client IDs.')
    .custom(async (friends) => {
      // Optionally, validate if friends exist in the database
      const validFriends = await Promise.all(friends.map(async (friendId) => {
        const friend = await clientModel.getClientById(friendId); // Implement getClientById method in clientModel
        return friend !== null;
      }));

      if (validFriends.includes(false)) {
        throw new Error('Some of the provided friends are not valid.');
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
