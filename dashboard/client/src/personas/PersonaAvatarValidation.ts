import * as Yup from 'yup';

const Validation = Yup.object().shape({
    avatar:
        Yup.string()
            .matches(
                /^(http(s?):)([/|.|\w|\s|-])*\.(?:gif|png|bmp|jpeg|jpg|webm)/,
                'Invalid image address.'
            )
            .max(
                2048,
                'Too long. Max 2048 characters.'
            )
            .required()
});

export default Validation;