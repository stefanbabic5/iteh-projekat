import React, { useEffect, useState } from "react";
import { Item, ItemGroup, Specification } from "../../types";
import { Button, Form, IconButton, Input, InputPicker, Modal, Schema, Uploader } from "rsuite";
import ImageIcon from '@rsuite/icons/Image';
import PlusIcon from '@rsuite/icons/Plus';
import SpecificationTable from "../SpecificationTable";
import ImageUpload from "./ImageUpload";

interface Props {
    item?: Item,
    open: boolean,
    onClose: () => void,
    onSubmit: (item: Partial<Item>) => Promise<void>,
    itemGroups: ItemGroup[]
}

//@ts-ignore
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const model = Schema.Model({
    name: Schema.Types.StringType().isRequired(),
    description: Schema.Types.StringType(),
    price: Schema.Types.NumberType().isRequired(),
    groupId: Schema.Types.NumberType().isRequired()
})

export default function ItemForm(props: Props) {
    const [specification, setSpecification] = useState<Specification>({});
    const [formState, setFormState] = useState<Partial<Item & { groupId: number }>>({});
    const [imageUrl, setImageUrl] = useState('');
    useEffect(() => {
        if (!props.open) {
            return;
        }
        if (!props.item) {
            setSpecification({});
            setFormState({});
            setImageUrl('');
            return;
        }
        const { specification, imageUrl, ...rest } = props.item
        setFormState({
            ...rest,
            groupId: rest.itemGroup?.id
        });
        setImageUrl(imageUrl);
        setSpecification(specification);
    }, [props.open, props.item])
    return (
        <Modal
            size='lg'
            open={props.open}
            onClose={props.onClose}
        >
            <Modal.Header>
                <Modal.Title>
                    <h3 className='text-center'>
                        Item Form
                    </h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, paddingRight: "20px" }}>
                    <Form
                        model={model}
                        formValue={formState}
                        onChange={val => {
                            setFormState(val);
                        }}
                        onSubmit={async (c) => {                           
                            if (!c) {
                                return;
                            }
                            await props.onSubmit({
                                ...formState,
                                specification,
                                itemGroup: props.itemGroups.find(e => e.id === formState.groupId),
                                imageUrl
                            })
                            props.onClose();
                        }}
                        fluid>
                        <Form.Group>
                            <Form.ControlLabel>Name</Form.ControlLabel>
                            <Form.Control name="name"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Price</Form.ControlLabel>
                            <Form.Control name="price"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Group</Form.ControlLabel>
                            <Form.Control name="groupId" className="fluid" accepter={InputPicker} data={props.itemGroups.map(element => {
                                return {
                                    value: element.id,
                                    label: element.name
                                }
                            })}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.ControlLabel>Description</Form.ControlLabel>
                            <Form.Control name="description" accepter={Textarea}/>
                        </Form.Group>

                        <Button type="submit" appearance="primary">
                            {props.item ? "Update" : "Create"}
                        </Button>
                    </Form>
                </div>
                <div style={{ flex:1, paddingLeft: "10px", paddingRight: "10px"}}>
                    <IconButton appearance="primary" icon={<PlusIcon/>} onClick={() => {
                        setSpecification(prev => {
                            return {
                                ...prev,
                                ['spec' + Object.keys(prev).length]: ''
                            }
                        })
                    }}/>
                    <SpecificationTable
                        specification={specification}
                        editing
                        onEditValue={(specName, val) => {
                            setSpecification(prev => {
                                return {
                                    ...prev,
                                    [specName]: val
                                }
                            })
                        }}
                        onEditName={(specName, newName) => {
                            setSpecification(prev => {
                                const newState = {...prev};
                                newState[newName] = newState[specName];
                                delete newState[specName];
                                return newState;
                            })
                        }}
                        onDelete={specName => {
                            setSpecification(prev => {
                                const newState = {...prev};
                                delete newState[specName];
                                return newState;
                            })
                        }}
                    />
                </div>
                <div style={{ flex: 1, paddingLeft: "20px"}}>                     
                        <div
                            style={{
                                backgroundImage: `url(${imageUrl || ''})`,
                                backgroundSize: 'cover',
                                height: '300px',
                                justifyContent: 'center',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {
                                !imageUrl && (
                                    <ImageIcon style={{ width: '100px', height: '100px' }}/>
                                )
                            }
                            
                        </div>
                        <ImageUpload onSuccess={(response) => setImageUrl(response.data.fileUrl)}/>
                    
                </div>
            </Modal.Body>
        </Modal>
    )
}