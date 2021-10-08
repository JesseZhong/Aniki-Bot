import * as Yup from 'yup';

const Validation = Yup.object().shape({
    triggers:
        Yup.array(
            Yup.string()
                .max(100, 'Too long! No more than 100 characters.')
                .matches(/^[^"']*$/, 'Cannot contain quotes.')
                .test(
                    'min-phrase',
                    'Too short! 1+ emoji or 3+ character phrases.',
                    (value?: string) => {
                        if (!value) {
                            return false;
                        }

                        // Only one emoji is needed.
                        if (/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(value)) {
                            return true;
                        }

                        // Regular character phrases require at least 3 non-whitespace characters
                        return value.trim().length >= 3;
                    }
                )
        )
        .min(1, 'Need at least 1.'),
    content:
        Yup.string()
            .max(2000, 'Messages can\'t be longer than 2000 characters.')
            .notRequired(),
    audio_url:
        Yup.string()
            .matches(
                /^https:\/\/(?:www\.|)(?:(?:youtube\.com\/(?:[^/\n]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)[^"&?/\s\n]{11}|(?:twitch\.tv\/[a-zA-Z0-9_]{4,25}\/clip\/[a-zA-Z0-9-]*)(?:$|\/.*$|\?.*$))/,
                'Not a valid Youtube or Twitch video.'
            )
            .notRequired()
});

export default Validation;