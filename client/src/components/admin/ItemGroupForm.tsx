import { Button, Form, InputPicker, Modal, Schema } from "rsuite";
import { ItemGroup } from "../../types";
import { useState } from "react";

interface Props {
    onSubmit: (group: Partial<ItemGroup>) => Promise<void>,
    open: boolean,
    onClose: () => void,
    groups: ItemGroup[]
}

const initial = {
    name: '',
    parentGroup: undefined
}

const model = Schema.Model({
    name: Schema.Types.StringType().isRequired(),
    parentGroup: Schema.Types.NumberType().isRequired()
})

export default function ItemGroupForm(props: Props) {
    const [formValue, setFormValue] = useState<Partial<ItemGroup>>(initial)
    return (
        <Modal
            size='lg'
            open={props.open}
            onClose={props.onClose}
        >
            <Modal.Header>
                <Modal.Title>Item groups</Modal.Title>
                <Modal.Body>
                    <Form
                        fluid
                        model={model}
                        formValue={formValue}
                        onChange={val => {
                            setFormValue(val);
                        }}
                        onSubmit={async (c, e) => {
                            await props.onSubmit(formValue);
                            setFormValue(initial);
                            props.onClose();
                        }}
                    >
                        <Form.Group>
                            <Form.ControlLabel>Name</Form.ControlLabel>
                            <Form.Control name="name"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Parent Group</Form.ControlLabel>
                            <Form.Control name="parentGroup" className="fluid" accepter={InputPicker} data={props.groups.map(element => {
                                return {
                                    value: element.id,
                                    label: element.name
                                }
                            })} />
                        </Form.Group>
                        <Button type="submit" appearance="primary">Create</Button>
                    </Form>
                </Modal.Body>
            </Modal.Header>
        </Modal>
    )
}