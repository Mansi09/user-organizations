
exports.seed = function (knex) {
  // Inserts seed entries
  return knex('email_templates').insert([
    {
      "id": 1,
      "slug": 'welcome_email',
      "title": 'Welcome Emaiil',
      "notes": `<p>
                you can use any of the following tags for make this template dynamic<br/>
                {{recipientName}} - For Users Firstname<br/>
                {{reset_token}} - For resetting password link
                <p>`,
      "created_at": new Date(),
      "updated_at": null,
      "deleted_at": null,
      "all_content": {
        "en": {
          "subject": "Welcome to system",
          "content": "<html>\n<head>\n\t<title></title>\n</head>\n<body>\n<p>Hi&nbsp;,</p>\n\n<p>Welcome to system.\n\nYour account has been created on our sytem. Please reset your password to continue on our system. your reset password linik is {{token}}\n Email: {{email}}\nThank you so much for joining us.\n\n <br/><p>Warm Regards,<br />\nThe System Team</p>\n</body>\n</html>\n",
          "note": "<p>\n\tyou can use any of the following tags for make this template dynamic<br/>\n\t{{recipientName}} - For Users Firstname<br/>\n\t{{email}} - For email <br/>\n\t{{token}} - For users resetting password\n<p>",
          "language": "English"
        },
        "ja": {
          "subject": "Welcome to system",
          "content": "<html>\n<head>\n\t<title></title>\n</head>\n<body>\n<p>Hi&nbsp;,</p>\n\n<p>Welcome to system.\n\nYour account has been created on our sytem. Please reset your password to continue on our system. your reset password linik is {{token}}\n Email: {{email}}\nThank you so much for joining us.\n\n <br/><p>Warm Regards,<br />\nThe System Team</p>\n</body>\n</html>\n",
          "note": "<p>\n\tyou can use any of the following tags for make this template dynamic<br/>\n\t{{recipientName}} - For Users Firstname<br/>\n\t{{email}} - For email <br/>\n\t{{token}} - For users resetting password\n<p>",
          "language": "Japanese"
        },
        "es": {
          "subject": "Welcome to system",
          "content": "<html>\n<head>\n\t<title></title>\n</head>\n<body>\n<p>Hi&nbsp;,</p>\n\n<p>Welcome to system.\n\nYour account has been created on our sytem. Please reset your password to continue on our system. your reset password linik is {{token}}\n Email: {{email}}\nThank you so much for joining us.\n\n <br/><p>Warm Regards,<br />\nThe System Team</p>\n</body>\n</html>\n",
          "note": "<p>\n\tyou can use any of the following tags for make this template dynamic<br/>\n\t{{recipientName}} - For Users Firstname<br/>\n\t{{email}} - For email <br/>\n\t{{token}} - For users resetting password\n<p>",
          "language": "Spanish"
        },
        "uk": {
          "subject": "Welcome to system",
          "content": "<html>\n<head>\n\t<title></title>\n</head>\n<body>\n<p>Hi&nbsp;,</p>\n\n<p>Welcome to system.\n\nYour account has been created on our sytem. Please reset your password to continue on our system. your reset password linik is {{token}}\n Email: {{email}}\nThank you so much for joining us.\n\n <br/><p>Warm Regards,<br />\nThe System Team</p>\n</body>\n</html>\n",
          "note": "<p>\n\tyou can use any of the following tags for make this template dynamic<br/>\n\t{{recipientName}} - For Users Firstname<br/>\n\t{{email}} - For email <br/>\n\t{{token}} - For users resetting password\n<p>",
          "language": "Ukrainian"
        },
        "ru": {
          "subject": "Welcome to system",
          "content": "<html>\n<head>\n\t<title></title>\n</head>\n<body>\n<p>Hi&nbsp;,</p>\n\n<p>Welcome to system.\n\nYour account has been created on our sytem. Please reset your password to continue on our system. your reset password linik is {{token}}\n Email: {{email}}\nThank you so much for joining us.\n\n <br/><p>Warm Regards,<br />\nThe System Team</p>\n</body>\n</html>\n",
          "note": "<p>\n\tyou can use any of the following tags for make this template dynamic<br/>\n\t{{recipientName}} - For Users Firstname<br/>\n\t{{email}} - For email <br/>\n\t{{token}} - For users resetting password\n<p>",
          "language": "Russia"
        },
        "zh": {
          "subject": "Welcome to system",
          "content": "<html>\n<head>\n\t<title></title>\n</head>\n<body>\n<p>Hi&nbsp;,</p>\n\n<p>Welcome to system.\n\nYour account has been created on our sytem. Please reset your password to continue on our system. your reset password linik is {{token}}\n Email: {{email}}\nThank you so much for joining us.\n\n <br/><p>Warm Regards,<br />\nThe System Team</p>\n</body>\n</html>\n",
          "note": "<p>\n\tyou can use any of the following tags for make this template dynamic<br/>\n\t{{recipientName}} - For Users Firstname<br/>\n\t{{email}} - For email <br/>\n\t{{token}} - For users resetting password\n<p>",
          "language": "Mandarin"
        }
      }
    }
  ]);
  // });
};
