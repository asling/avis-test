/*
 * Footer Messages
 *
 * This contains all the text for the Footer component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  licenseMessage: {
    id: 'avispocdemo.components.Footer.license.message',
    defaultMessage: 'This project is licensed under the MIT license.',
  },
  authorMessage: {
    id: 'avispocdemo.components.Footer.author.message',
    defaultMessage: `
      Power by {author}.
    `,
  },
});
