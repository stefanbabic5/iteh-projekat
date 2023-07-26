import { useState } from 'react';
import { Button, Form, Message, Schema, toaster, Uploader } from 'rsuite';
import { RegisterUser } from '../types';
import { Link } from 'react-router-dom';

const model = Schema.Model({

    email: Schema.Types.StringType().isRequired().isEmail(),
    firstName: Schema.Types.StringType().isRequired(),
    lastName: Schema.Types.StringType().isRequired(),
    phone: Schema.Types.StringType().isRequired(),
    password: Schema.Types.StringType().isRequired(),
    repeat: Schema.Types.StringType().isRequired().addRule((v, d) => v === d.password, 'Passwords are not the same', true)
})

interface Props {
    onSubmit: (val: RegisterUser) => Promise<void>
}

export default function Register(props: Props) {
    const [formValue, setFormValue] = useState<RegisterUser>({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      repeat: ''
    })
    return (
      <div>
        <h2>Register</h2>
        <Form
          fluid
          model={model}
          formValue={formValue}
          checkTrigger='none'
          onChange={value => {
            //@ts-ignore
            setFormValue(value);
          }}
          onSubmit={async (c) => {
            if (!c) {
              return;
            }
            props.onSubmit(formValue);
          }}
        >
          <Form.Group controlId='firstName'>
            <Form.ControlLabel>First name</Form.ControlLabel>
            <Form.Control name='firstName' />
          </Form.Group>
          <Form.Group controlId='lastName'>
            <Form.ControlLabel>Last name</Form.ControlLabel>
            <Form.Control name='lastName' />
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control name='email' />
          </Form.Group>
          <Form.Group controlId='phone'>
            <Form.ControlLabel>Phone</Form.ControlLabel>
            <Form.Control name='phone' />
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.ControlLabel>Password</Form.ControlLabel>
            <Form.Control type='password' name='password' />
          </Form.Group>
          <Form.Group controlId='repeat'>
            <Form.ControlLabel>Repeat</Form.ControlLabel>
            <Form.Control type='password' name='repeat' />
          </Form.Group>
          <Button className='fluid' type='submit' appearance='primary'>Register</Button>
        </Form>
        <Link to='/'>
          <Button className='fluid' appearance='link'>Already have an acount</Button>
        </Link>
      </div>
    )
}