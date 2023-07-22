import {FormikHelpers, useFormik} from 'formik'
import * as Yup from 'yup'
import { ContentBox } from '../UI/ContentBox'
import { InputField } from '../UI/InputField'
import { Button } from '../UI/Button'

export interface LoginFormNames{
    password: string
    email: string
}

export interface RegisterFormProps {
    onCancel?: ()=>void
    onSubmit: (form: LoginFormNames) => void
}

interface FormField {
    name: keyof LoginFormNames
    label: string
    type: 'text' | 'number' | 'email' | 'password'
    placeholder: string
}

const initialValues: LoginFormNames = {
    password:'',
    email:''
}

const validationSchema =  Yup.object({
        password: Yup.string().required('Поле должно быть заполнено').min(5, 'не меннее 5 символов'),
        email: Yup.string().email('Неправильный формат email').required('Поле должно быть заполнено'),
    })

 const formFields: FormField[] = [
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Введите Ваш email'

    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Введите пароль'

    },
]

export const Login = ({
    onCancel = () =>{},
    onSubmit
}: RegisterFormProps) => {

    const sentForm = (data:LoginFormNames, helpers: FormikHelpers<LoginFormNames>) => {
        onSubmit(data)
        helpers.resetForm()
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: sentForm,
    })    

    const closeForm = () => {
        onCancel()
        formik.resetForm()
    }

  return (
    <ContentBox
        title='Login'
    >
        <div className='p-5'>
            <form  className='flex flex-col gap-5' 
            onSubmit={formik.handleSubmit}
            >
                {
                  formFields.map( input => 
                      <InputField
                          key={input.name}
                          {...input}
                          id={input.name} 
                          error = {formik.errors[input.name] && formik.touched[input.name] && formik.errors[input.name]}
                          value={formik.values[input.name]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                      />
                  )
                }
            </form>
            <div className='flex justify-around mt-7 gap-3'>
                <Button 
                    className='w-full'
                    title='Sent'
                    onClick={formik.submitForm}
                />
                <Button 
                    className='w-full'
                    title='Cancel'
                    onClick={closeForm}
                />
            </div>
        </div>
    </ContentBox>
  )
}
