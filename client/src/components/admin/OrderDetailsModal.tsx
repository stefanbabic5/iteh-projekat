import { Modal, Table } from "rsuite";
import { Order } from "../../types";

interface Props {
    order?: Order,
    open: boolean,
    onClose: () => void
}

export default function OrderDetailsModal(props: Props) {
    return (
        <Modal
            size="lg"
            open={props.open}
            onClose={props.onClose}
        >
            <Modal.Header>
                <Modal.Title>Order Items</Modal.Title>
                <Modal.Body>
                    <Table
                        data={props.order?.orderItems || []}
                        style={{width: '100%'}}    
                    >
                        <Table.Column flexGrow={1}>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.Cell>                               
                                {(rowData, rowIndex) => {
                                    //@ts-ignore
                                    return rowIndex + 1
                                }}
                            </Table.Cell>
                        </Table.Column>
                        <Table.Column flexGrow={4}>
                            <Table.HeaderCell>Item name</Table.HeaderCell>
                            <Table.Cell dataKey="itemName"/>
                        </Table.Column>
                        <Table.Column flexGrow={2}>
                            <Table.HeaderCell>Unit price</Table.HeaderCell>
                            <Table.Cell dataKey="itemPrice"/>
                        </Table.Column>
                        <Table.Column flexGrow={2}>
                            <Table.HeaderCell>Count</Table.HeaderCell>
                            <Table.Cell dataKey="count"/>
                        </Table.Column>
                        <Table.Column flexGrow={2}>
                            <Table.HeaderCell>Total</Table.HeaderCell>
                            <Table.Cell>
                                {
                                    (item) => {
                                        //@ts-ignore
                                        return item.count * item.itemPrice;
                                    }
                                }
                            </Table.Cell>
                        </Table.Column>
                    </Table>
                </Modal.Body>
            </Modal.Header>
        </Modal>
    )
}