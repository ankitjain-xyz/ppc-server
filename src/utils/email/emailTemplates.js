import createToken from '../createToken';

const serverUrl = process.env.SERVER_HOST || 'http://localhost:4000';
const confirmationSecret = process.env.CONFIRMATION_SECRET;
const confirmationTimer = process.env.CONFIRMATION_EXPIRES_IN;
const forgotPasswordSecret = process.env.CONFIRMATION_SECRET;
const forgotPasswordTimer = process.env.CONFIRMATION_EXPIRES_IN;

const fromEmail = process.env.EMAIL;

export const invitationEmail = (user, thisUser) => {
  const token = createToken(user, confirmationSecret, confirmationTimer);
  const html = `
  <html>
    <body>
      <p>
        Hi,
      </p>
      <p>
        Please accept this invite to PPC, our tool for production and process control.
        Using PPC, we plan and track job cards, and collaborate to get work done. You are invited by
        <a href='mailto:${thisUser.email}'>${thisUser.firstName} ${thisUser.lastName}</a>.
      </p>
      <p>
        <a href='${serverUrl}/confirmation?email=${user.email}&token=${token}'>
          Accept Invitation
        </a>
      </p>
      <p>
        See you soon.
      </p>
    </body>
  </html>`;

  return {
    to: `${user.email}`,
    from: {
      address: fromEmail,
      name: 'TiknaTech',
    },
    subject: 'Invitation to PPC',
    html,
  };
};

export const welcomeEmail = (user) => {
  const token = createToken(user, confirmationSecret, confirmationTimer);
  const html = `
  <html>
    <body>
      <p>
        Hi,
      </p>
      <p>
        Thank you for choosing PPC at TiknaTech! 
        You are just one click away from completing your account registration.
      </p>
      <p>
        <a href='${serverUrl}/confirmation?email=${user.email}&&token=${token}'>
          Confirm your email
        </a>
      </p>
    </body>
  </html>`;

  return {
    to: `${user.email}`,
    from: {
      address: fromEmail,
      name: 'TiknaTech',
    },
    subject: 'Please complete your registration - PPC',
    html,
  };
};

export const notificationNewUser = (user) => {
  const html = `
  <html>
    <body>
      <p>
        New user:
        <a href='mailto:${user.email}'>
          ${user.email}
        </a>
      </p>
    </body>
  </html>`;

  return {
    to: `${fromEmail}`,
    from: {
      address: fromEmail,
      name: 'TiknaTech',
    },
    subject: 'New user on TiknaTech @PPC',
    html,
  };
};

export const forgotPassword = (user) => {
  const token = createToken(user, forgotPasswordSecret, forgotPasswordTimer);
  const html = `
  <html>
  <body>
    <p>
      Hi,
    </p>
    <p>
      Did you request a password reset? 
      Please click the link below to reset your password.
    </p>
    <p>
      <a href='${serverUrl}/password-reset?email=${user.email}&&token=${token}'>
        Reset Password
      </a>
    </p>
    <p>
      If you think it was not you, please contact us urgently.
    </p>
  </body>
  </html>`;

  return {
    to: `${user.email}`,
    from: {
      address: fromEmail,
      name: 'TiknaTech',
    },
    subject: 'Password reset - PPC',
    html,
  };
};
