import * as Yup from 'yup';

const Validation = (
    existingNames: Set<string>
) =>
Yup.object().shape({
    name:
        Yup.string()
            .matches(
                /^(?!.{0,32}[@#:].{0,32}|discordtag$|everyone$|here$|```).{2,32}$/,
                "Cannot contain '@', '#', ':' or '```'.\nCannot be 'discordtag', 'everyone', or 'here'."
            )
            .min(
                2,
                'Too short. 2+ characters.'
            )
            .max(
                32,
                'Too long. Max 32 characters.'
            )
            .test(
                'unique',
                'Name already exists.',
                (value) => !(value && existingNames?.has(value))
            )
            .required()
});

export default Validation;