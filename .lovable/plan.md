# Voice input for complaint descriptions

Add a microphone control beside the complaint description so people can dictate instead of typing.

## What will change
- Use the browser's built-in speech recognition for live Hindi or English dictation, matching the selected app language.
- Append recognized words to the existing description; keep manual editing and submission unchanged.
- Show clear listening, stop, unsupported-browser, and permission/error states in both languages.
- Verify the report form still loads and the dictation control behaves safely when speech recognition is unavailable.

## Technical details
- Keep the feature client-side in the existing report form; no database, account, or server changes.
- Use the existing language context, semantic styles, and icon library.
