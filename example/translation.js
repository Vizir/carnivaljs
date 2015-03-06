var app = angular.module('exampleApp');
app.config(function (TranslationProvider) {
  TranslationProvider.setTranslation({
    'CREATE_STATE_TITLE': 'Create',
    'EDIT_STATE_TITLE': 'Edit',
    'LIST_STATE_TITLE': 'List',
    'SHOW_STATE_TITLE': 'Show',
    'LIST_STATE_BUTTON_CREATE': 'Create',
    'DELETE_BUTTON_DELETE': 'Delete',
    'DELETE_BUTTON_CANCEL': 'Cancel',
    'DELETE_BUTTON_CONFIRM': 'Confirm',
    'FORM_BUTTON_SAVE': 'Save',
    'GALLERY_BUTTON_OPEN': 'Open Gallery',
    'LISTING_ACTIONS': 'Actions',
    'LISTING_EXTRA_ACTIONS': 'Extra Actions',
    'LISTING_BUTTON_SHOW': 'Show',
    'LISTING_BUTTON_EDIT': 'Edit',
    'LISTING_HAS_MANY_PREFIX': 'View',
    'NESTED_FORM_BUTTON_CREATE': 'Create',
    'NESTED_FORM_TITLE_CREATE': 'Create',
    'SEARCH_FORM_TITLE': 'Search',
    'ARE_YOU_SURE': 'Are you Sure',
    'SEARCH_FORM_SUBMIT': 'Submit',
    'UPLOAD_BUTTON': 'Upload',
    'FORM_BUTTON_EDIT': 'Edit'
  });
});
