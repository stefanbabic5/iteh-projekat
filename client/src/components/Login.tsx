import { Button, Form, Message, Schema, toaster } from "rsuite";
import { LoginUser } from "../types";
import { useState } from "react";
import { Link } from "react-router-dom";

const model = Schema.Model({
    email: Schema.Types.StringType().isRequired().isEmail(),
    password: Schema.Types.StringType().isRequired()
})

interface Props {
    onSubmit: (u: LoginUser) => Promise<any>
}

export default function Login(props: Props) {
    const [formValue, setFormValue] = useState<LoginUser>({
        email: '',
        password: ''
    });
    return (
        <div>
            <h2 className="loginReg">Login</h2>
            <Form
                className="loginRegForma"
                fluid
                model = {model}
                formValue={formValue}
                checkTrigger='none'
                onChange={value => {
                    //@ts-ignore
                    setFormValue(value);
                  }}
                onSubmit={(c) => {
                    if (!c) {
                        return;
                    }
                    props.onSubmit(formValue);
                }}
            >
                <Form.Group controlId='email'>
                    <Form.ControlLabel>Email</Form.ControlLabel>
                    <Form.Control name='email'/>
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.ControlLabel>Password</Form.ControlLabel>
                    <Form.Control type='password' name='password' />
                </Form.Group>
                <Button className='fluid' type='submit' appearance='primary'>Login</Button>
            </Form>
            <Link to='/register'>
                <Button className='fluid' appearance='link'>Don't have an account?</Button>
            </Link>
        </div>
    )
}