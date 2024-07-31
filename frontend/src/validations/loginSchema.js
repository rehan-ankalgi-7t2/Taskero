import * as yup from 'yup';
export const loginValidationSchema = yup.object({
    email: yup
        .string()
        .required('Please enter your email')
        .email('Invalid Email Id')
        .max(100)
        .matches(/^([\w\d._\-#])+@([\w\d._\-#]+[.][\w\d._\-#]+)+$/gm, 'Invalid Mail'),

    password: yup.string().min(6).required('Please enter password')
});