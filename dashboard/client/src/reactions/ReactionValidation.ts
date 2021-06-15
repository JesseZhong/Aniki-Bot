import * as Yup from 'yup';

const Validation = Yup.object().shape({
    triggers:
        Yup.array(
            Yup.string()
                .min(3, 'Too short! 3+ character phrases.')
                .max(100, 'Too long! No more than 100 characters.')
                .matches(/^[^"']*$/)
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